let Parser = require('../lib/FlowParser')

let fs = require('fs')

describe('Harcon-Flow', function () {
	let flows, linkFlows, errorFlow
	before(function (done) {
		try {
			flows = [
				{ name: 'react', def: fs.readFileSync('./test/react.flow', 'utf8'), validation: require('./react') },
				{ name: 'continue', def: fs.readFileSync('./test/continue.flow', 'utf8'), validation: require('./continue') }
			]
			linkFlows = [
				{ name: 'make an offer', def: fs.readFileSync('./test/link.flow', 'utf8'), validation: require('./link') },
				{ name: 'calculate the prices', def: fs.readFileSync('./test/continue.flow', 'utf8'), validation: require('./continue') }
			]
			errorFlow = { name: 'react on error', def: fs.readFileSync('./test/error.flow', 'utf8'), validation: require('./react') }
			done()
		} catch (err) { done(err) }
	} )

	describe('Test Flow conversion', function () {
		it('Simple', function (done) {
			Parser.generateDefs( flows, {} )
				.then( (flow) => {
					console.log( '.....', JSON.stringify( flow ) )
					done()
				} )
				.catch( (reason) => {
					done(reason)
				} )
		} )

		it('Link', function (done) {
			Parser.generateDefs( linkFlows, {} )
				.then( (flow) => {
					console.log( '.....', JSON.stringify( flow ) )
					done()
				} )
				.catch( (reason) => {
					done(reason)
				} )
		} )

		it('Error', function (done) {
			Parser.generateDefs( [errorFlow], {} )
				.then( (flow) => {
					console.log( '.....', JSON.stringify( flow ) )
					done()
				} )
				.catch( (reason) => {
					done(reason)
				} )
		} )
	} )

	describe('Test Graph conversion', function () {
		it('D3', function (done) {
			Parser.generateDefs( linkFlows, { d3: true } )
				.then( (flow) => {
					console.log( '.....', flow.graph )
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
