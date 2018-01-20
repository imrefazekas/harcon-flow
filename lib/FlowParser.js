var Assigner = require('assign.js')
var assigner = new Assigner().excluded( ['message'] )

var D3 = require('./D3')

function densify (str) {
	return str.replace(/[^A-Za-z0-9\{\}\[\]<>\{\}\(\)]+/g, '')
}
function namify ( str ) {
	if (!str) return str
	return ( densify( str ).charAt(0).toUpperCase() + str.slice(1).toLowerCase() ).match(/[A-Z][A-Za-z0-9]*/g)[0]
}
function messagify ( str ) {
	if (!str) return str
	return ( densify( str ).charAt(0).toLowerCase() + str.slice(1) ).match(/[a-z][A-Za-z0-9]+/g)[0]
}

function extractActor (actor) {
	if ( actor.startsWith('()') ) return { actor: actor.substring(2), web: true }
	if ( actor.startsWith('<>') ) return { actor: actor.substring(2), websocket: true }
	if ( actor.startsWith('{}') ) return { actor: actor.substring(2), websocket: true, rest: true }
	if ( actor.startsWith('[]') ) return { actor: actor.substring(2), rest: true }
	return { actor: actor }
}

function getType (sign) {
	switch ( sign ) {
	case '->': return 'series'
	case '=>': return 'waterfall'
	case '>>': return 'spread'
	}
	throw new Error('Malformed rule')
}

function extractEntity (def, res) {
	res = res || {}

	if ( def.startsWith('[') && def.endsWith(']') ) {
		res.link = def.substring( 1, def.length - 1 ).trim()
		return res
	}

	if ( def.startsWith('*') ) {
		res.foreach = true
		def = def.substring( 1 )
	}

	let seps = def.split('|')
	if ( seps.length > 1 ) {
		res.domain = seps[0].trim()
		def = seps[1].trim()
	}
	var comp = def.split(':')
	res = assigner.assign( res, extractActor( densify( comp[0].trim() ) ) )
	res.actor = namify( res.actor )

	if (comp.length > 1) res.message = messagify( comp[1].trim() )

	return res
}

function extractSource ( title, def ) {
	var res = { message: messagify(title) }
	if ( def.startsWith('->') || def.startsWith('=>') || def.startsWith('>>') ) {
		res.external = true
		res.rest = true
		res.websocket = true
		def = def.substring( 2 )
	} else {
		res.internal = true
	}

	res.type = getType( def.substring( def.length - 2 ) )
	def = def.substring( 0, def.length - 2 )

	return extractEntity( def, res )
}
function clean (def) {
	return def.split('//')[0].trim()
}

function findActor ( actor, actors ) {
	var existing = actors.find( function (ref) { return ref.actor === actor.actor } )

	if (existing) {
		existing.rest = existing.rest || !!actor.rest
		existing.websocket = existing.websocket || !!actor.websocket
		existing.web = existing.web || !!actor.web
		existing.domain = existing.domain || !!actor.domain
	} else {
		actors.push( assigner.assign( { }, actor ) )
	}
}
function collectActors ( flows ) {
	var actors = []
	flows.forEach( function (flow) {
		findActor( flow.source, actors )
		flow.messages.forEach( function (message) {
			findActor( message, actors )
		} )
	} )
	return actors
}

module.exports = {
	valid: async function ( flowDefs ) {
		var self = this
		try {
			let flows = await self.generateDefs( flowDefs, {} )
			return { valid: true, flows: flows }
		} catch (err) {
			return { valid: false, error: err }
		}
	},
	generateDefs: async function ( flowDefs, opts = {} ) {
		var self = this

		var res = { }
		let flows = await Promise.all( flowDefs.map( function (flowDef) {
			return self.parse( flowDef.name || flowDef.title, flowDef.def, flowDef.validation, flowDef.timeout )
		} ) )

		flows.forEach( function (flow) {
			flow.messages.forEach( function (message) {
				if (!message.link) return

				var flowLink = flows.find( function (flow) { return flow.title === message.link } )
				if (!flowLink) throw new Error('Unknown link: ' + message.link)

				message.actor = flowLink.source.actor
				message.message = flowLink.source.message
			} )
		} )

		res.flows = flows
		res.actors = collectActors( flows )

		var defs = res.flows.map( function (flow) {
			var def = {}
			def[ flow.source.actor + '.' + flow.source.message ] = {
				type: flow.source.type,
				primers: flow.messages.map( function (message) { return message.actor + '.' + message.message } ),
				validation: flow.validation,
				timeout: flow.timeout
			}
			return def
		} )
		res.defs = assigner.assign.apply( assigner, defs )

		if (opts.d3) res.graph = D3.graphify( res )

		return res
	},
	parse: async function ( title, flowDef, validation = {}, timeout ) {
		if (!flowDef) throw new Error('No content passed')

		var def = flowDef.split('\n').map( function (def) { return def.trim() } ).filter( function (def) {
			return def.length > 0 && !def.startsWith('#') && !def.startsWith('//')
		} )
		if ( def.length < 2 ) throw new Error('The flow definition seems to be invalid: ' + flowDef)

		var source = extractSource( title, clean( def[0] ) )
		var messages = []

		def.slice( 1 ).forEach( function (exchange) {
			messages.push( extractEntity( clean( exchange ) ) )
		} )
		return { title: title, source: source, messages: messages, validation: validation, timeout: timeout }
	}
}
