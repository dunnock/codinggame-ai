import { traceJSON, trace, _TRACE } from "./log"
import { treeSearch, DecisionTreeNode, SmartAction, FunctionalActionsTreeExpander, BFS } from "./treesearch"

function findPath(field, depth = 0) {
	traceJSON("predictOptions ", arguments);
	let treeExpander = new GameActions(field);
	let res = treeSearch(
			field, {
			treeExpander, 
			checkTarget: isExit,
			depthLimit: depth,
			queue: new BFS()
		});
	return res;
}

function isExit(node) {
	return node.state.player.at(node.state.exit)
}

let _visited = new Set()

// On every state (pod position) search will try following actions, 
// branching search until it reaches target
class GameActions extends FunctionalActionsTreeExpander {
	constructor(field) {
		super([
				(node) => node.state.cellsAroundPlayer()
									.filter(cell => Move.IsApplicable(node.state, cell))
									.map(cell => new Move(node.state, cell))
			])
	}
}

// Moving by one turn in the specified direction (neighbour of the cell in the field)
class Move extends SmartAction {
	constructor(field, cell) {
		super({cell});
		this.name = "Move";
		this.cost = 1;
	}
	apply(node) {
		traceJSON("Visit cell", this.cell)
		_visited.add(node.state.player.key + "t" + this.cell.key)
		return node.state.movePlayer(this.cell)
	}
	static IsApplicable(field, cell) {
		trace(`Check visit cell ${cell.x} ${cell.y} ${cell.type} from ${field.player.x} ${field.player.y}`)
		return field.player.canMoveTo(cell) && !_visited.has(field.player.key + "t" + cell.key)
	}
}

export default findPath;
