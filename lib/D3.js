module.exports = {
	graphify: function ( flows ) {
		let res = {
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
