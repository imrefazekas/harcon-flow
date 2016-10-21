let Parser = require('../lib/FlowParser')

let fs = require('fs')

describe('Harcon-Flow', function () {
	let flows, linkFlows
	before(function (done) {
		try {
			flows = [
				{ name: 'react', def: fs.readFileSync('./test/react.flow', 'utf8') },
				{ name: 'continue', def: fs.readFileSync('./test/continue.flow', 'utf8') }
			]
			linkFlows = [
				{ name: 'make an offer', def: fs.readFileSync('./test/link.flow', 'utf8') },
				{ name: 'calculate the prices', def: fs.readFileSync('./test/continue.flow', 'utf8') }
			]
			done()
		} catch (err) { done(err) }
	} )

	describe('Test Flow conversion', function () {
		it('Simple', function (done) {
			Parser.generateDefs( flows )
			.then( (flow) => {
				console.log( '.....', JSON.stringify( flow ) )
				done()
			} )
			.catch( (reason) => {
				done(reason)
			} )
		} )

		it('Link', function (done) {
			Parser.generateDefs( linkFlows )
			.then( (flow) => {
				console.log( '.....', JSON.stringify( flow ) )
				done()
			} )
			.catch( (reason) => {
				done(reason)
			} )
		} )
	} )

	after(function (done) {
		done()
	} )

} )
