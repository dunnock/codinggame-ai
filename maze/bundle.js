/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _pathfinder = __webpack_require__(1);

	var _pathfinder2 = _interopRequireDefault(_pathfinder);

	var _maze = __webpack_require__(5);

	var _log = __webpack_require__(2);

	var _config = __webpack_require__(3);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Auto-generated code below aims at helping you parse
	 * the standard input according to the problem statement.
	 **/

	_config2.default.logger = printErr;

	const ARRAY = n => new Array(n).fill("");

	var inputs = readline().split(' ');
	var starty = parseInt(inputs[0]);
	var startx = parseInt(inputs[1]);
	var inputs = readline().split(' ');
	var endy = parseInt(inputs[0]);
	var endx = parseInt(inputs[1]);
	var inputs = readline().split(' ');
	var h = parseInt(inputs[0]);
	var w = parseInt(inputs[1]);
	var field = ARRAY(h).map(readline);

	let maze = new _maze.MazeArena(field, startx, starty, endx, endy);
	printErr(maze.toString());

	let res = (0, _pathfinder2.default)(maze, 100);

	for (let l of res.result.root.leaves()) printErr(l.state.toString());

	print(res.result.node.cost);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _log = __webpack_require__(2);

	var _treesearch = __webpack_require__(4);

	function findPath(field, depth = 0) {
		(0, _log.traceJSON)("predictOptions ", arguments);
		let treeExpander = new GameActions(field);
		let res = (0, _treesearch.treeSearch)(field, {
			treeExpander,
			checkTarget: isExit,
			depthLimit: depth,
			queue: new _treesearch.BFS()
		});
		return res;
	}

	function isExit(node) {
		return node.state.player.at(node.state.exit);
	}

	let _visited = new Set();

	// On every state (pod position) search will try following actions, 
	// branching search until it reaches target
	class GameActions extends _treesearch.FunctionalActionsTreeExpander {
		constructor(field) {
			super([node => node.state.cellsAroundPlayer().filter(cell => Move.IsApplicable(node.state, cell)).map(cell => new Move(node.state, cell))]);
		}
	}

	// Moving by one turn in the specified direction (neighbour of the cell in the field)
	class Move extends _treesearch.SmartAction {
		constructor(field, cell) {
			super({ cell });
			this.name = "Move";
			this.cost = 1;
		}
		apply(node) {
			(0, _log.traceJSON)("Visit cell", this.cell);
			_visited.add(node.state.player.key + "t" + this.cell.key);
			return node.state.movePlayer(this.cell);
		}
		static IsApplicable(field, cell) {
			(0, _log.trace)(`Check visit cell ${ cell.x } ${ cell.y } ${ cell.type } from ${ field.player.x } ${ field.player.y }`);
			return field.player.canMoveTo(cell) && !_visited.has(field.player.key + "t" + cell.key);
		}
	}

	exports.default = findPath;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.trace = exports.traceJSON = exports._DEBUG = exports._TRACE = undefined;

	var _config = __webpack_require__(3);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	const _TRACE = 1;
	const _DEBUG = 2;

	function traceJSON(desc, json, level = _DEBUG) {
		if (_config2.default.log_level < level) return;
		let str = desc + ": " + JSON.stringify(json, function (key, value) {
			if (key == 'parent' || key == 'children' || key == 'field' || key == 'route' || key == 'optimalSuccessor') {
				return "#REF";
			} else {
				return value;
			}
		});
		trace(str, level);
	}

	function trace(text, level = _DEBUG) {
		if (_config2.default.log_level < level) return;
		if (_config2.default.logger) _config2.default.logger(text);else console.log(text);
	}

	exports._TRACE = _TRACE;
	exports._DEBUG = _DEBUG;
	exports.traceJSON = traceJSON;
	exports.trace = trace;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
		"log_level": 1
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.BFS = exports.DFS = exports.FunctionalActionsTreeExpander = exports.ActionsTreeExpander = exports.SmartAction = exports.DecisionTreeNode = exports.Result = exports.startTreeDeepSearch = exports.treeMaxSearch = exports.treeSearch = undefined;

	var _log = __webpack_require__(2);

	const SEARCH_CUTOFF = Symbol.for("findsolution.cutoff");
	const SCORE = (benefit, cost) => benefit * 4 - cost;

	// options is a structure of:
	//   {treeExpander, evalStateUtility, evalTerminalUtility, depthLimit = 10}

	function startTreeDeepSearch(initialState, options) {
		let node = new DecisionTreeNode(initialState, { benefit: 0, utility: 0 });

		let optimal = treeDeepSearch(node, options).finalSuccessor();

		if (optimal) return new SuccessResult({ node: optimal, root: node });else return new FailureResult(SEARCH_CUTOFF, { root: node });
	}

	// Performs tree search going through nodes in the order defined by queue.
	// Nodes in the tree expanded using TreeExpander class instance
	//   initialState - starting point for the search
	//   treeGen class instance of TreeExpander
	//	 checkTarget function accepts node.state, should return true if search target achieved
	//	 use queue DFS for Depth First Search, BFS is used by default
	/// TODO - REWRITE ALL THIS BENEFIT CALCULATION
	function treeDeepSearch(node, options) {
		if (node.reassigned) // node from cache
			return node;

		let { treeExpander, evalStateUtility, evalTerminalUtility, depthLimit = 10 } = options;
		if (node.parent) {
			node.utility = evalStateUtility(node);
			node.benefit = node.parent.benefit + node.utility;
		}
		let terminal = node.depth >= options.depthLimit;

		//// TODO: add condition to cancel search when score is too low
		let optimalSuccessor = !terminal ? treeExpander.expandNode(node).map(child => treeDeepSearch(child, options)).reduce((prev, cur) => prev && prev.score > cur.score ? prev : cur, false) : false;

		if (terminal || !optimalSuccessor) {
			node.terminalUtility = evalTerminalUtility(node);
			node.benefit += node.terminalUtility;
			node.score = SCORE(node.benefit, node.cost);
		} else {
			node.score = optimalSuccessor.score;
			node.optimalSuccessor = optimalSuccessor;
		}

		return node;
	}

	// Action interface, action applied to node generates successor node
	// Subclass must overload
	//   .isApplicable(DecisionTreeNode)
	//		returns true if action can be applied to the node.
	//		Please note, cutting off nodes from the search can decrease search complexity
	//		from O(b^d) to O(b*d) (e.g. increase performance), where b is average number
	// 		of branches from usual node and d is search depth
	//   .apply(DecisionTreeNode node)
	//		should return successor state of a node.state, which will be automatically
	//		wrapped into DecisionTreeNode
	//   .cost()
	//		cost of action later aggregated into path cost. By default cost of action is 1.
	// Please note, subclass constructor can call super(props) to initialize its
	// instance properties, in fact it just does following:
	//		Object.assign(this, params); 
	// Nevertheless action is a verb, its defined as class to let it contain its configuration
	class SmartAction {
		constructor(params) {
			Object.assign(this, params);
		}
		// apply action to decisionTreeNode.state, returns resulting state
		apply(decisionTreeNode) {
			throw new Error("SmartAction is abstract class, should not be instantiated");
		}
	}

	// TreeExpander interface, action applied to node generates successor node
	// Subclass must overload expandNode method, accepting treeNode instance of DecisionTreeNode, 
	// returning array of expanded nodes instances of DecisionTreeNode
	class TreeExpander {
		// treeNode
		expandNode(treeNode) {
			throw new Error("TreeExpander is abstract class, should not be instantiated");
		}
	}

	// Node leafs represent states, branch is action.
	// Action is transforming node into successor node.
	// New ActionsTreeExpander([new SmartAction1(), new SmartAction2()])

	/// NOT WORKING ANYMORE, child node should be created via constructor in the expander now
	class ActionsTreeExpander extends TreeExpander {
		constructor(actions) {
			super();
			this.actions = actions;
			throw "ActionsTreeExpander NOT WORKING ANYMORE, child node should be created via constructor in the expander now";
		}
		expandNode(node) {
			return this.runActions(node, this.actions);
		}
		runActions(node, actions) {
			return actions.map(action => ({ action, applicable: action.isApplicable(node) })).filter(r => r.applicable).map(r => ({ action: r.action, state: r.action.apply(node, r.applicable) })).map(r => node.addChild(r));
		}
	}

	let _cache = {};

	function updateOptimalRouteScores(node, parentBenefit, parentCost) {
		let score;
		for (let n = node; n; n = n.optimalSuccessor) {
			parentBenefit = n.benefit = n.utility + parentBenefit;
			parentCost = n.cost = n.action.cost + parentCost;
			if (!n.optimalSuccessor) {
				if (n.terminalUtility) n.benefit += n.terminalUtility;
				score = SCORE(n.benefit, n.cost);
			}
		}
		for (let n = node; n; n = n.optimalSuccessor) n.score = score;
	}

	function executeCachedAction(node, action, result) {
		if (node.depth == 0) _cache = {};
		let key = action.key,
		    child;
		if (!key) child = new DecisionTreeNode(action.apply(node), { action, parent: node });else if (!_cache[key]) _cache[key] = child = new DecisionTreeNode(action.apply(node), { action, parent: node });else {
			let cachedParent = _cache[key].parent;
			let profit = SCORE(node.benefit, node.cost) - SCORE(cachedParent.benefit, cachedParent.cost);
			child = profit > 0 ? _cache[key] : undefined;
			if (child) {
				(0, _log.traceJSON)(`Cache ${ key } ${ child.state.player.x } ${ child.state.player.y } depth ${ child.depth } (parent ${ cachedParent.state.player.x } ${ cachedParent.state.player.y }) hit by ${ action.name } out of node ${ node.state.player.x } ${ node.state.player.y } depth ${ node.depth }: `, child.action, _log._TRACE);
				updateOptimalRouteScores(child, node.benefit, node.cost);
				child.reassigned = true; //FOR DEBUG PURPOSE ONLY
			}
		}
		if (child) result.push(child);
	}
	// Node leafs represent states, branch is action.
	// Action is transforming node into successor node.
	// New FunctionalActionsTreeExpander([F1 => [new SmartAction1(), new SmartAction2()]])
	// Functions should return array of actions to be executed on node
	class FunctionalActionsTreeExpander extends TreeExpander {
		constructor(functions) {
			super([]);
			this.functions = functions;
		}
		expandNode(node) {
			let result = [];
			let actions = this.functions.map(func => func(node)).forEach(arr => arr.forEach(action => executeCachedAction(node, action, result)));
			return result;
		}
	}

	// DecisionTree is a resulting tree structure with state and action stored
	class DecisionTreeNode {
		constructor(state, options) {
			this.state = state;
			Object.assign(this, options);
			this.children = new Array();
			if (this.parent) {
				this.parent.children.push(this);
				this.cost = this.action.cost + this.parent.cost;
				this.depth = this.parent.depth + 1;
			} else {
				this.cost = 0;
				this.depth = 0;
			}
		}
		addChild(node) {
			this.children.push(node);
			node.parent = this;
			return node;
		}
		finalSuccessor() {
			//		traceJSON("finalSuccessor", this.action, _TRACE)
			if (this.optimalSuccessor) return this.optimalSuccessor.finalSuccessor();else return this;
		}
		*leaves() {
			//		traceJSON("", Object.assign({}, this, {state: this.state.playerCell()}), _TRACE)
			if (this.children.length == 0) yield this;else for (let node of this.children) yield* node.leaves();
		}
		duplicate(queue) {
			for (let node of queue) if (node.state.similar(this.state)) return true;
			return false;
		}
	}

	// Search result types
	class Result {
		constructor({ success = true, result }) {
			this.success = success;
			this.result = result;
		}
	}

	// success result 
	class SuccessResult extends Result {
		constructor({ node, root }) {
			super({ result: { node, root } });
		}
	}

	class FailureResult extends Result {
		constructor(failure, { root }) {
			super({ success: false, result: { root } });
			this.failure = failure;
		}
	}

	// QUEUES: use for DFS or BFS search order
	class DFS extends Array {
		next() {
			return this.pop();
		}
	}

	class BFS extends Array {
		next() {
			return this.shift();
		}
	}

	// Performs tree search going through nodes in the order defined by queue.
	// Nodes in the tree expanded using TreeExpander class instance
	//   initialState - starting point for the search
	//   treeGen class instance of TreeExpander
	//	 checkTarget function accepts node.state, should return true if search target achieved
	//	 use queue DFS for Depth First Search, BFS is used by default
	function treeMaxSearch({ initialState, treeExpander, evalStateUtility, evalTerminalUtility, queue, depthLimit = 0 }) {
		// Validate input params
		if (!(treeExpander instanceof TreeExpander)) throw new Error("treeGen parameter should be instanceof TreeExpander subclass");
		if (!queue.next || !queue.push) throw new Error("queue should have push and next functions defined");

		//Initialize either from the state or from queue
		let root = new DecisionTreeNode(initialState, { benefit: 0 });
		queue.push(root);

		let maxScore = -9999,
		    maxNode;
		let totalNodes = 0;

		// Go through all nodes in the order defined by queue.next,
		// expanding every node further to the queue using treeGen.expandNode
		while (queue.length > 0) {
			let node = queue.next(),
			    leaf;
			//		traceJSON("queue", queue);
			if (!(node instanceof DecisionTreeNode)) throw new Error(`Incorrect node was generated by treeExpander: ${ node }`);
			if (depthLimit > 0 && node.depth >= depthLimit || node.action && node.action.terminal /* || totalNodes > nodesLimit */) leaf = node;else {
				(0, _log.traceJSON)("Expanding node ", node);
				let expander = treeExpander.expandNode(node);
				if (expander.length) expander.forEach(node => {
					node.benefit = node.parent.benefit + evalStateUtility(node);
				});else leaf = node;
				totalNodes += expander.length;
				//if(queue.length > 10) expander = expander.filter(node => !node.duplicate(queue))
				queue.push(...expander);
				//			traceJSON("Expanded node with ", expander)
			}

			if (leaf) {
				leaf.benefit += evalTerminalUtility(leaf);
				leaf.score = SCORE(leaf.benefit, leaf.cost);
				if (leaf.score > maxScore) {
					maxScore = leaf.score;
					maxNode = leaf;
				}
			}
		}

		if (maxNode) return new SuccessResult({ node: maxNode, root });else return new FailureResult(SEARCH_ERROR, { root });
	}

	// Performs tree search going through nodes in the order defined by queue.
	// Nodes in the tree expanded using TreeExpander class instance
	//   initialState - starting point for the search
	//   treeGen class instance of TreeExpander
	//	 checkTarget function accepts node.state, should return true if search target achieved
	//	 use queue DFS for Depth First Search, BFS is used by default
	function treeSearch(initialState, { treeExpander, checkTarget, queue, depthLimit = 0 }) {
		// Validate input params
		if (!(treeExpander instanceof TreeExpander)) throw new Error("treeGen parameter should be instanceof TreeExpander subclass");
		if (!queue.next || !queue.push) throw new Error("queue should have push and next functions defined");

		//Initialize either from the state or from queue
		let root = new DecisionTreeNode(initialState);
		queue.push(root);

		let totalNodes = 0;

		// Go through all nodes in the order defined by queue.next,
		// expanding every node further to the queue using treeGen.expandNode
		while (queue.length > 0) {
			let node = queue.next();
			//		traceJSON("queue", queue);
			if (!(node instanceof DecisionTreeNode)) throw new Error(`Incorrect node was generated by treeExpander: ${ node }`);
			if (checkTarget(node)) return new SuccessResult({ node, root });
			if (!(depthLimit > 0 && node.depth >= depthLimit) && !(node.action && node.action.terminal)) {
				(0, _log.traceJSON)("Expanding node ", node);
				let expander = treeExpander.expandNode(node);
				totalNodes += expander.length;
				queue.push(...expander);
				//			traceJSON("Expanded node with ", expander)
			}
		}

		return new FailureResult(SEARCH_CUTOFF, { root });
	}

	exports.treeSearch = treeSearch;
	exports.treeMaxSearch = treeMaxSearch;
	exports.startTreeDeepSearch = startTreeDeepSearch;
	exports.Result = Result;
	exports.DecisionTreeNode = DecisionTreeNode;
	exports.SmartAction = SmartAction;
	exports.ActionsTreeExpander = ActionsTreeExpander;
	exports.FunctionalActionsTreeExpander = FunctionalActionsTreeExpander;
	exports.DFS = DFS;
	exports.BFS = BFS;
	exports.default = treeMaxSearch;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.MazeArena = exports.MazePlayer = undefined;

	var _player = __webpack_require__(6);

	var _player2 = _interopRequireDefault(_player);

	var _arena = __webpack_require__(7);

	var _arena2 = _interopRequireDefault(_arena);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	* "." floor
	* "+" short wall
	* "|" vertical slope
	* "-" horizontal slope
	* "#" high wall
	* "X" bridge
	*/

	// This is example implementation of Cell and Player objects for codinggame 2.5D Maze

	const _traversable = {
		'..': (p1, p2) => true,
		'.X': (p1, p2) => true,
		'X.': (p1, p2) => true,
		'.|': (p1, p2) => Math.abs(p1.y - p2.y) == 1,
		'|.': (p1, p2) => Math.abs(p1.y - p2.y) == 1,
		'.-': (p1, p2) => Math.abs(p1.x - p2.x) == 1,
		'-.': (p1, p2) => Math.abs(p1.x - p2.x) == 1,
		'++': (p1, p2) => true,
		'+X': (p1, p2) => true,
		'X+': (p1, p2) => true,
		'+|': (p1, p2) => Math.abs(p1.y - p2.y) == 1,
		'|+': (p1, p2) => Math.abs(p1.y - p2.y) == 1,
		'+-': (p1, p2) => Math.abs(p1.x - p2.x) == 1,
		'-+': (p1, p2) => Math.abs(p1.x - p2.x) == 1,
		'X|': (p1, p2) => Math.abs(p1.y - p2.y) == 1,
		'|X': (p1, p2) => Math.abs(p1.y - p2.y) == 1,
		'X-': (p1, p2) => Math.abs(p1.x - p2.x) == 1,
		'-X': (p1, p2) => Math.abs(p1.x - p2.x) == 1
	};

	const _celllevel = { '.': 1, '+': 2, '|': 3, '-': 3, 'X': 3 }; // other cells have variable level or impossible to move over

	// Cell class provides definition of cell types traversability
	class MazePlayer extends _player2.default {
		constructor(x, y, cell) {
			super(x, y);
			this.level = _celllevel[cell.type] || 1;
			this.key = `x${ x }y${ y }l${ this.level }`;
			this.type = cell.type;
		}
		canMoveTo(cell) {
			let condition = _traversable[this.type + cell.type];
			return condition === true || condition && condition(this, cell);
		}
		move(cell) {
			let player = super.move(cell);
			player.type = cell.type;
			let cellLevel = _celllevel[cell.type];
			if (cellLevel) player.level = cellLevel;
			return player;
		}
	}

	class MazeArena extends _arena2.default {
		constructor(textFields, playerx, playery, exitx, exity) {
			super(textFields[0].length, textFields.length, textFields);
			this.player = new MazePlayer(playerx, playery, this.cellXY(playerx, playery));
			this.exit = this.cellXY(exitx, exity);
		}
		// Immutable method, returns new Arena with updated player position
		movePlayer(pos) {
			let arena = this.clone(true, false);
			arena.player = this.player.move(pos);
			return arena;
		}
		cellsAroundPlayer() {
			return this.cellsAroundXY(this.player.x, this.player.y);
		}
		playerCell() {
			return this.cell(this.player);
		}
		clone(cloneTable = false, clonePlayer = false) {
			let bf = super.clone(cloneTable);
			bf.player = clonePlayer ? this.player.clone() : this.player;
			bf.exit = this.exit;
			return bf;
		}
		toString() {
			return this.field.map((r, y) => r.split('').map((c, x) => c + (this.player.at({ x, y }) ? 'P' : this.exit.at({ x, y }) ? 'E' : ' ')).join('')).join('\n');
		}
	}

	exports.MazePlayer = MazePlayer;
	exports.MazeArena = MazeArena;
	exports.default = MazeArena;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	class Player {
		constructor(x, y) {
			Object.assign(this, { x, y });
		}
		clone() {
			return Object.assign(Object.create(this), this);
		}
		// Immutable move, returns new Player instance
		move(cell) {
			return Object.assign(this.clone(), { x: cell.x, y: cell.y });
		}
		at(pos) {
			return this.x == pos.x && this.y == pos.y;
		}
	}

	exports.default = Player;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	// General class, reusable in all 2D mazes implementations
	// Arena is a multiline text representation of the battlefield, where 
	//  - every character represents type of the cell
	//  - player is a subtype of Player

	const MAXWIDTHSHIFT = 14;

	class Arena {
	    constructor(width, height, field, objects) {
	        Object.assign(this, { width, height, field }, objects);
	    }
	    //Immutable method, returns new arena
	    setCell(x, y, type) {
	        let arena = this.clone(true, false);
	        arena.table[y] = this.field[y].slice(0, x) + type + this.field[y].slice(x + 1);
	        return arena;
	    }
	    cell(pos) {
	        if (!pos) return undefined;
	        return this.cellXY(pos.x, pos.y);
	    }
	    cellXY(x, y) {
	        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return undefined;
	        return new CellProxy(x, y, this.field[y][x]);
	    }
	    cellsAroundXY(x, y) {
	        return [this.cellXY(x - 1, y), this.cellXY(x + 1, y), this.cellXY(x, y - 1), this.cellXY(x, y + 1)].filter(c => c ? true : false);
	    }
	    clone(cloneTable = true) {
	        let bf = Object.create(this);
	        bf.table = cloneTable ? this.field.slice() : this.field;
	        bf.width = this.width;
	        bf.height = this.height;
	        return bf;
	    }
	    toString() {
	        return this.field.join('\n');
	    }
	}

	class CellProxy {
	    constructor(x, y, type) {
	        Object.assign(this, { x, y, type });
	    }
	    at(pos) {
	        return this.x == pos.x && this.y == pos.y;
	    }
	    get key() {
	        return this.y << MAXWIDTHSHIFT | this.x;
	    }
	}

	exports.Arena = Arena;
	exports.CellProxy = CellProxy;
	exports.default = Arena;

/***/ }
/******/ ]);