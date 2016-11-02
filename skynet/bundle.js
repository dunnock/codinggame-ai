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

	'use strict';

	var _skynet = __webpack_require__(1);

	var _predictor = __webpack_require__(2);

	var _predictor2 = _interopRequireDefault(_predictor);

	var _log = __webpack_require__(3);

	var _config = __webpack_require__(4);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Auto-generated code below aims at helping you parse
	 * the standard input according to the problem statement.
	 **/

	_config2.default.logger = printErr;

	const depth = 10;

	var inputs = readline().split(' ');
	var N = parseInt(inputs[0]); // the total number of nodes in the level, including the gateways
	var L = parseInt(inputs[1]); // the number of links
	var E = parseInt(inputs[2]); // the number of exit gateways

	let net = new _skynet.Skynet(N);

	for (var i = 0; i < L; i++) {
	    var inputs = readline().split(' ');
	    var N1 = parseInt(inputs[0]); // N1 and N2 defines a link between these nodes
	    var N2 = parseInt(inputs[1]);
	    net.addLink(N1, N2);
	}
	for (var i = 0; i < E; i++) {
	    var EI = parseInt(readline()); // the index of a gateway node
	    net.addExit(EI);
	}

	// game loop
	while (true) {
	    var SI = parseInt(readline()); // The index of the node on which the Skynet agent is positioned this turn

	    // Write an action using print()
	    // To debug: printErr('Debug messages...');

	    net.agent = SI;

	    let prediction = (0, _predictor2.default)({ node: net.nodes[SI], depth });
	    let node = prediction.result.node;
	    let answer = [node.state.id, node.parent.state.id];

	    (0, _log.traceJSON)(`Node cost ${ node.cost } benefit ${ node.benefit } score ${ node.score } `, node.action, _log._TRACE);

	    net.removeLink(...answer);
	    node.parent.state.exits.delete(node.state);

	    // Example: 0 1 are the indices of the nodes you wish to sever the link between
	    print(answer.join(' '));
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	class Skynet {
		constructor(numNodes) {
			this.nodes = new Array(numNodes).fill(1).map((n, id) => new Node(id));
			this.agent = undefined;
		}
		addLink(id1, id2) {
			this.nodes[id1].addLink(this.nodes[id2]);
		}
		removeLink(id1, id2) {
			this.nodes[id1].removeLink(this.nodes[id2]);
		}
		addExit(id) {
			let node = this.nodes[id];
			node.exit = true;
			node.links.forEach(linked => linked.exits.add(node));
		}
	}

	class Node {
		constructor(id) {
			this.id = id;
			this._links = new Set();
			this.exit = false;
			this.exits = new Set();
		}
		addLink(destinationNode) {
			this._links.add(destinationNode);
			destinationNode._links.add(this);
		}
		removeLink(destinationNode) {
			this._links.delete(destinationNode);
			destinationNode._links.delete(this);
		}
		get links() {
			return [...this._links.values()];
		}
	}

	exports.Skynet = Skynet;
	exports.Node = Node;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _log = __webpack_require__(3);

	var _treesearch = __webpack_require__(5);

	var _skynet = __webpack_require__(1);

	function predictOptions({ node, depth = 6 }) {
		(0, _log.traceJSON)("predictOptions ", arguments);
		let treeExpander = new GameActions();
		let res = (0, _treesearch.treeMaxSearch)({ initialState: node,
			treeExpander,
			evalStateUtility,
			evalTerminalUtility,
			depthLimit: depth,
			queue: new _treesearch.BFS()
		});
		return res;
	}

	function evalStateUtility(node) {
		return node.parent.state.exits == 0 ? -3 : 0;
	}

	function evalTerminalUtility(node) {
		if (node.state.exit) {
			if (node.parent.depth == 0) return 100;else return node.parent.state.exits.size * 3;
		} else return -100;
	}

	// On every state (pod position) search will try following actions, 
	// branching search until it reaches target
	class GameActions extends _treesearch.FunctionalActionsTreeExpander {
		constructor() {
			let visits = new Set();
			super([node => node.state.links.filter(destination => Move.IsApplicable(node.state, destination, visits)).map(destination => new Move(node.state, destination, visits))]);
			this.visits = visits;
		}
	}

	// Moving by one turn in the specified direction (neighbour of the cell in the field)
	class Move extends _treesearch.SmartAction {
		constructor(src, dest, visits) {
			super({ src, dest, visits });
			this.name = "Move";
			this.cost = src.exits.size == 1 ? 0 : 1;
			this.key = `m${ src.id }t${ dest.id }`;
		}
		apply() {
			this.visits.add(this.key);
			return this.dest;
		}
		static IsApplicable(src, dest, visits) {
			return !visits.has(`m${ src.id }t${ dest.id }`) && !src.exit;
		}
	}

	exports.default = predictOptions;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.traceField = exports.trace = exports.traceJSON = exports._DEBUG = exports._TRACE = undefined;

	var _config = __webpack_require__(4);

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

	function traceField(field, level = _DEBUG) {
		trace(field.toStrings().map(s => "  " + s).join("\n"), level);
	}

	exports._TRACE = _TRACE;
	exports._DEBUG = _DEBUG;
	exports.traceJSON = traceJSON;
	exports.trace = trace;
	exports.traceField = traceField;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
		"log_level": 1
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.BFS = exports.DFS = exports.FunctionalActionsTreeExpander = exports.ActionsTreeExpander = exports.SmartAction = exports.DecisionTreeNode = exports.Result = exports.startTreeDeepSearch = exports.treeMaxSearch = undefined;

	var _log = __webpack_require__(3);

	const SEARCH_CUTOFF = Symbol.for("findsolution.cutoff");
	const SEARCH_ERROR = Symbol.for("findsolution.error");
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
		isApplicable(decisionTreeNode) {
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

/***/ }
/******/ ]);