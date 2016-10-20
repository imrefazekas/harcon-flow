let Parser = require('../lib/FlowParser')

let fs = require('fs')

describe('Harcon-Flow', function () {
	let flows
	before(function (done) {
		try {
			flows = [
				{ name: 'react', def: fs.readFileSync('./test/react.flow', 'utf8') },
				{ name: 'continue', def: fs.readFileSync('./test/continue.flow', 'utf8') }
			]
			done()
		} catch (err) { done(err) }
	} )

	describe('Test Flow conversion', function () {
		it('Bulk convert', function (done) {
			Parser.generateDefs( flows )
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
