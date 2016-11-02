class Skynet {
	constructor(numNodes) {
		this.nodes = (new Array(numNodes)).fill(1).map((n,id) => new Node(id))
		this.agent = undefined
	}
	addLink(id1, id2) {
		this.nodes[id1].addLink(this.nodes[id2])
	}
	removeLink(id1, id2) {
		this.nodes[id1].removeLink(this.nodes[id2])
	}
	addExit(id) {
		let node = this.nodes[id]
		node.exit = true
		node.links.forEach(linked => linked.exits.add(node))
	}
}

class Node {
	constructor(id) {
		this.id = id
		this._links = new Set()
		this.exit = false
		this.exits = new Set()
	}
	addLink(destinationNode) {
		this._links.add(destinationNode)
		destinationNode._links.add(this)
	}
	removeLink(destinationNode) {
		this._links.delete(destinationNode)
		destinationNode._links.delete(this)
	}
	get links() {
		return [...this._links.values()]
	}
}

export {Skynet, Node}