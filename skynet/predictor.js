import { traceJSON, _TRACE } from "./log"
import { treeMaxSearch, DecisionTreeNode, SmartAction, FunctionalActionsTreeExpander, BFS } from "./treesearch"
import { Skynet, Node } from './skynet.js'

function predictOptions({node, depth = 6}) {
	traceJSON("predictOptions ", arguments);
	let treeExpander = new GameActions();
	let res = treeMaxSearch(
			{initialState: node,
			treeExpander, 
			evalStateUtility,
			evalTerminalUtility,
			depthLimit: depth,
			queue: new BFS()
		});
	return res;
}

function evalStateUtility(node) {
	return node.parent.state.exits == 0 ? -3 : 0
}

function evalTerminalUtility(node) {
	if(node.state.exit) {
		if(node.parent.depth==0)
			return 100
		else
			return node.parent.state.exits.size * 3
	} else 
		return -100
}

// On every state (pod position) search will try following actions, 
// branching search until it reaches target
class GameActions extends FunctionalActionsTreeExpander {
	constructor() {
		let visits = new Set()
		super([
				(node) => node.state.links
								.filter(destination => Move.IsApplicable(node.state, destination, visits))
								.map(destination => new Move(node.state, destination, visits)) 
			])
		this.visits = visits
	}
}

// Moving by one turn in the specified direction (neighbour of the cell in the field)
class Move extends SmartAction {
	constructor(src, dest, visits) {
		super({src, dest, visits})
		this.name = "Move"
		this.cost = (src.exits.size == 1) ? 0 : 1
		this.key = `m${src.id}t${dest.id}`
	}
	apply() {
		this.visits.add(this.key)
		return this.dest
	}
	static IsApplicable(src, dest, visits) {
		return !visits.has(`m${src.id}t${dest.id}`) && !src.exit
	}
}

export default predictOptions;
