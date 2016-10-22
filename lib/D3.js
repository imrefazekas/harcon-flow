module.exports = {
	graphify: function ( flows ) {
		var res = {
			nodes: [],
			links: []
		}

		flows.actors.forEach( (actor) => {
			res.nodes.push( {
				id: actor.actor,
				group: flows.flows.find( (flow) => { return flow.source.actor === actor.actor } ) ? '1' : '2'
			} )
		} )

		flows.flows.forEach( (flow) => {
			flow.messages.forEach( (message) => {
				var link = res.links.find( function (link) { return link.source === flow.source.actor && link.target === message.actor } )
				if (link) link.message = link.message + (link.message.length > 0 ? ', ' : '') + message.message
				else
					res.links.push( {
						source: flow.source.actor,
						target: message.actor,
						message: message.message,
						type: flow.source.type
					} )
			} )
		} )

		return res
	}
}
