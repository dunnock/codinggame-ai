import { traceJSON, _TRACE } from "./log"
import { startTreeDeepSearch, DecisionTreeNode, SmartAction, FunctionalActionsTreeExpander, BFS } from "./treesearch"

module.exports.predictOptions = predictOptions;

function predictOptions({field, depth = 6}) {
	traceJSON("predictOptions ", arguments);
	let treeExpander = new GameActions(field);
	field.cell(field.player).visited = true;
	let res = startTreeDeepSearch(
			field, {
			treeExpander, 
			evalStateUtility,
			evalTerminalUtility,
			depthLimit: depth
		});
	return res;
}

function evalStateUtility(node) {
	let field = node.state
	let benefit = field.benefit(field.cell(field.player))
	if(node.action.name == "Bomb")
		return benefit.bomb
	else // if(node.action.name != "Wait")
		return benefit.move
//	else
//		return 0
}

function evalTerminalUtility(node) {
	let field = node.state
	let benefit = field.benefit(field.cell(field.player));
	let cellsAround = field.cellsAroundPlayer();
	if(cellsAround.every(c => !c.isTraversable()))
		return -100
	else if(benefit.move < 0)
		return -60
	else
		return Math.round(benefit.bomb / 3) + field.player.bombsLeft * 5
}

// On every state (pod position) search will try following actions, 
// branching search until it reaches target
class GameActions extends FunctionalActionsTreeExpander {
	constructor(field) {
		super([
				(node) => node.state.playerCell().isDanger() ? 
								node.state.cellsAroundPlayer()
									.filter(cell => Escape.IsApplicable(node.state, cell))
									.map(cell => new Escape(node.state, cell)) :
								node.state.cellsAroundPlayer()
									.filter(cell => Move.IsApplicable(node.state, cell))
									.map(cell => new Move(node.state, cell)),
				(node) => Bomb.IsApplicable(node.state) ? [new Bomb(node.state)] : []
//				(node) => Wait.IsApplicable(node.state) ? [new Wait(node.state)] : []
			])
	}
}

// Deploy bomb, does not consume turn
class Bomb extends SmartAction {
	constructor(field) {
		super({field});
		this.name = "Bomb";
		this.cost = 0;
		this.player = field.player;
		this.cell = field.playerCell()
		this.key = "b" + this.cell.key + field.key
	}
	apply(node) {
		return this.field.deployPlayerBomb(true)
	}
	isApplicable(node) {
		return Bomb.IsApplicable(node.state)
	}
	static IsApplicable(field) {
		let cell = field.playerCell()
		return !cell.isSuperDanger() && field.player.bombsLeft && field.benefit(cell).bomb > 0 && cell.isTraversable()
	}
}

// Moving by one turn in the specified direction (neighbour of the cell in the field)
class Move extends SmartAction {
	constructor(field, cell) {
		super({cell});
		this.name = "Move";
		this.cost = 1;
		this.key = "m" + cell.key + field.key
	}
	apply(node) {
		return node.state.movePlayer(this.cell)
	}
	isApplicable(node) {
		return Move.IsApplicable(node.state, this.cell)
	}
	static IsApplicable(field, cell) {
		return !cell.isDanger() && !cell.visited && cell.isTraversable()
	}
}

// Escape from the field with Bomb
class Escape extends SmartAction {
	constructor(field, cell) {
		super({cell})
		this.name = "Escape"
		this.cost = 1
		this.key = "e" + cell.key + field.key
	}
	apply(node) {
		let field = node.state
		field = field.movePlayer(this.cell)
		field.playerCell().escapeVisited = true
		return field
	}
	isApplicable(node) {
		return Escape.IsApplicable(node.state, this.cell)
	}
	static IsApplicable(field, cellNew) {
		let cellOld = field.playerCell()
		return !cellNew.escapeVisited && cellNew.isTraversable() && !cellOld.isSaferThan(cellNew)
	}
}


// Wait in the cell, is a terminal state
//  -  |  -  |  +
// .X. | .X. | .X.
// X!. | X.. | !.!
// .!. | .!. | .!.
class Wait extends SmartAction {
	constructor(field) {
		super({field});
		this.name = "Wait";
		this.cost = 0;
		this.terminal = true;
	}
	apply(node) {
		return this.field
	}
	isApplicable(node) {
		return Wait.IsApplicable(node.state)
	}
	static IsApplicable(field) {
		//when cell is not in danger and all cells around either not traversable or danger
		return !field.playerCell().isDanger() &&
				!field.cellsAroundPlayer().some(cell => cell.isTraversable() && !cell.isDanger());
	}
}

export default predictOptions;
