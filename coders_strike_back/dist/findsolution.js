"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.BFS = exports.DFS = exports.ActionsTreeExpander = exports.SmartAction = exports.DecisionTreeNode = exports.Result = exports.findOptimalSolution = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _log = require("./log");

function _extendableBuiltin3(cls) {
	function ExtendableBuiltin() {
		var instance = Reflect.construct(cls, Array.from(arguments));
		Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
		return instance;
	}

	ExtendableBuiltin.prototype = Object.create(cls.prototype, {
		constructor: {
			value: cls,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});

	if (Object.setPrototypeOf) {
		Object.setPrototypeOf(ExtendableBuiltin, cls);
	} else {
		ExtendableBuiltin.__proto__ = cls;
	}

	return ExtendableBuiltin;
}

function _extendableBuiltin(cls) {
	function ExtendableBuiltin() {
		var instance = Reflect.construct(cls, Array.from(arguments));
		Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
		return instance;
	}

	ExtendableBuiltin.prototype = Object.create(cls.prototype, {
		constructor: {
			value: cls,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});

	if (Object.setPrototypeOf) {
		Object.setPrototypeOf(ExtendableBuiltin, cls);
	} else {
		ExtendableBuiltin.__proto__ = cls;
	}

	return ExtendableBuiltin;
}

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var SEARCH_CUTOFF = Symbol.for("findsolution.cutoff");

// Performs tree search going through nodes in the order defined by queue.
// Nodes in the tree expanded using TreeExpander class instance
//   initialState - starting point for the search
//   treeGen class instance of TreeExpander
//	 checkTarget function accepts node.state, should return true if search target achieved
//	 use queue DFS for Depth First Search, BFS is used by default
function findOptimalSolution(_ref) {
	var initialState = _ref.initialState;
	var treeExpander = _ref.treeExpander;
	var checkTarget = _ref.checkTarget;
	var _ref$depthLimit = _ref.depthLimit;
	var depthLimit = _ref$depthLimit === undefined ? 0 : _ref$depthLimit;
	var _ref$queue = _ref.queue;
	var queue = _ref$queue === undefined ? new BFS() : _ref$queue;

	// Validate input params
	if (!(treeExpander instanceof TreeExpander)) throw new Error("treeGen parameter should be instanceof TreeExpander subclass");
	if (!queue.next || !queue.push) throw new Error("queue should have push and next functions defined");

	//Initialize either from the state or from queue
	var root;
	if (queue.length == 0) {
		root = new DecisionTreeNode({ state: initialState });
		queue.push(root);
	} else {
		// If queue is not empty we expectits initialized with root node
		root = queue[0];
	}

	// Go through all nodes in the order defined by queue.next,
	// expanding every node further to the queue using treeGen.expandNode
	while (queue.length > 0) {
		var node = queue.next();
		//		traceJSON("queue", queue);
		if (!(node instanceof DecisionTreeNode)) throw new Error("Incorrect node was generated by treeExpander: " + node);
		if (checkTarget(node.state)) return new SuccessResult({ node: node, root: root });
		if (depthLimit == 0 || node.depth < depthLimit) {
			(0, _log.traceJSON)("Expanding node ", node);
			var expander = treeExpander.expandNode(node);
			if (queue.length > 10) expander = expander.filter(function (node) {
				return !node.duplicate(queue);
			});
			queue.push.apply(queue, _toConsumableArray(expander));
			//			traceJSON("Expanded node with ", expander)
		}
	}
	return new FailureResult(SEARCH_CUTOFF, { root: root });
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

var SmartAction = function () {
	function SmartAction(params) {
		_classCallCheck(this, SmartAction);

		Object.assign(this, params);
	}
	// apply action to decisionTreeNode.state, returns resulting state


	_createClass(SmartAction, [{
		key: "apply",
		value: function apply(decisionTreeNode) {
			throw new Error("SmartAction is abstract class, should not be instantiated");
		}
	}, {
		key: "isApplicable",
		value: function isApplicable(decisionTreeNode) {
			throw new Error("SmartAction is abstract class, should not be instantiated");
		}
	}, {
		key: "cost",
		value: function cost() {
			return 1;
		}
	}]);

	return SmartAction;
}();

// TreeExpander interface, action applied to node generates successor node
// Subclass must overload expandNode method, accepting treeNode instance of DecisionTreeNode, 
// returning array of expanded nodes instances of DecisionTreeNode


var TreeExpander = function () {
	function TreeExpander() {
		_classCallCheck(this, TreeExpander);
	}

	_createClass(TreeExpander, [{
		key: "expandNode",

		// treeNode
		value: function expandNode(treeNode) {
			throw new Error("TreeExpander is abstract class, should not be instantiated");
		}
	}]);

	return TreeExpander;
}();

// Node leafs represent states, branch is action.
// Action is transforming node into successor node.
// New ActionsTreeExpander([new SmartAction1(), new SmartAction2()])


var ActionsTreeExpander = function (_TreeExpander) {
	_inherits(ActionsTreeExpander, _TreeExpander);

	function ActionsTreeExpander(actions) {
		_classCallCheck(this, ActionsTreeExpander);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ActionsTreeExpander).call(this));

		_this.actions = actions;
		return _this;
	}

	_createClass(ActionsTreeExpander, [{
		key: "expandNode",
		value: function expandNode(node) {
			return this.actions.filter(function (action) {
				return action.isApplicable(node);
			}).map(function (action) {
				(0, _log.traceJSON)("exec action", action);
				return node.addChild(action);
			});
		}
	}]);

	return ActionsTreeExpander;
}(TreeExpander);

// DecisionTree is a resulting tree structure with state and action stored


var DecisionTreeNode = function () {
	function DecisionTreeNode(_ref2) {
		var _ref2$action = _ref2.action;
		var action = _ref2$action === undefined ? null : _ref2$action;
		var _ref2$parent = _ref2.parent;
		var parent = _ref2$parent === undefined ? null : _ref2$parent;
		var _ref2$state = _ref2.state;
		var state = _ref2$state === undefined ? null : _ref2$state;

		_classCallCheck(this, DecisionTreeNode);

		this.parent = parent;
		this.state = parent && action ? action.apply(parent) : state;
		this.action = action;
		this.depth = parent ? parent.depth + 1 : 0;
		this.children = [];
	}

	_createClass(DecisionTreeNode, [{
		key: "addChild",
		value: function addChild(action) {
			var node = new DecisionTreeNode({ action: action, parent: this });
			this.children.push(node);
			return node;
		}
	}, {
		key: "path",
		value: function path() {
			if (this.depth == 0) return [this];
			var path = this.parent.path();
			path.push(this);
			return path;
		}
	}, {
		key: "duplicate",
		value: function duplicate(queue) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = queue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var node = _step.value;

					if (node.state.similar(this.state)) return true;
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return false;
		}
	}]);

	return DecisionTreeNode;
}();

// Search result types


var Result = function Result(_ref3) {
	var _ref3$success = _ref3.success;
	var success = _ref3$success === undefined ? true : _ref3$success;
	var result = _ref3.result;

	_classCallCheck(this, Result);

	this.success = success;
	this.result = result;
};

// success result 


var SuccessResult = function (_Result) {
	_inherits(SuccessResult, _Result);

	function SuccessResult(_ref4) {
		var node = _ref4.node;
		var root = _ref4.root;

		_classCallCheck(this, SuccessResult);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(SuccessResult).call(this, { result: { node: node, root: root } }));
	}

	return SuccessResult;
}(Result);

var FailureResult = function (_Result2) {
	_inherits(FailureResult, _Result2);

	function FailureResult(failure, _ref5) {
		var root = _ref5.root;

		_classCallCheck(this, FailureResult);

		var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(FailureResult).call(this, { success: false, result: { root: root } }));

		_this3.failure = failure;
		return _this3;
	}

	return FailureResult;
}(Result);

// QUEUES: use for DFS or BFS search order


var DFS = function (_extendableBuiltin2) {
	_inherits(DFS, _extendableBuiltin2);

	function DFS() {
		_classCallCheck(this, DFS);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(DFS).apply(this, arguments));
	}

	_createClass(DFS, [{
		key: "next",
		value: function next() {
			return this.pop();
		}
	}]);

	return DFS;
}(_extendableBuiltin(Array));

var BFS = function (_extendableBuiltin4) {
	_inherits(BFS, _extendableBuiltin4);

	function BFS() {
		_classCallCheck(this, BFS);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(BFS).apply(this, arguments));
	}

	_createClass(BFS, [{
		key: "next",
		value: function next() {
			return this.shift();
		}
	}]);

	return BFS;
}(_extendableBuiltin3(Array));

exports.findOptimalSolution = findOptimalSolution;
exports.Result = Result;
exports.DecisionTreeNode = DecisionTreeNode;
exports.SmartAction = SmartAction;
exports.ActionsTreeExpander = ActionsTreeExpander;
exports.DFS = DFS;
exports.BFS = BFS;
exports.default = findOptimalSolution;