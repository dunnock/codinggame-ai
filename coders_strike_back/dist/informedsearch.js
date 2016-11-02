"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ConfigurableFunction = exports.InformedActionsTreeExpander = exports.findOptimalSolutionIBFS = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // find solution via informed search


var _findsolution = require("./findsolution");

var _log = require("./log");

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

// Performs tree search going through nodes in the order defined by queue.
// Nodes in the tree expanded using TreeExpander class instance
//   initialState - starting point for the search
//   treeGen class instance of TreeExpander
//	 checkTarget function accepts node.state, should return true if search target achieved
//	 use queue DFS for Depth First Search, BFS is used by default
function findOptimalSolutionIBFS(_ref) {
	var initialState = _ref.initialState;
	var treeExpander = _ref.treeExpander;
	var checkTarget = _ref.checkTarget;
	var depthLimit = _ref.depthLimit;
	var heuristic = _ref.heuristic;

	var root = new InformedDecisionTreeNode({ state: initialState, heuristic: heuristic });
	var queue = new HOBFS(InformedDecisionTreeNode.compareInformedDecisionTreeNodes);
	queue.push(root);
	return (0, _findsolution.findOptimalSolution)({ treeExpander: treeExpander, checkTarget: checkTarget, queue: queue, depthLimit: depthLimit });
}

var ConfigurableFunction = function () {
	function ConfigurableFunction() {
		_classCallCheck(this, ConfigurableFunction);
	}

	_createClass(ConfigurableFunction, [{
		key: "apply",
		value: function apply() {}
	}]);

	return ConfigurableFunction;
}();

// Node leafs represent states, branch is action.
// Action is transforming node into successor node.
// New ActionsTreeExpander([new SmartAction1(), new SmartAction2()])


var InformedActionsTreeExpander = function (_ActionsTreeExpander) {
	_inherits(InformedActionsTreeExpander, _ActionsTreeExpander);

	function InformedActionsTreeExpander(actions) {
		_classCallCheck(this, InformedActionsTreeExpander);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(InformedActionsTreeExpander).call(this, actions));
	}

	_createClass(InformedActionsTreeExpander, [{
		key: "expandNode",
		value: function expandNode(node) {
			return this.actions
			//			.filter(action => action.isApplicable(node))
			.map(function (action) {
				(0, _log.traceJSON)("exec action", action);
				return node.addChild(action);
			});
		}
	}]);

	return InformedActionsTreeExpander;
}(_findsolution.ActionsTreeExpander);

// DecisionTree is a resulting tree structure with state and action stored
// adds two parameters to DecisionTreeNode:
//   	targetEstimate -- estimated cost to get to target state from the node (h(n) in CS)
//	    pathCost -- cost of the path to the node (g(n) in CS)


var InformedDecisionTreeNode = function (_DecisionTreeNode) {
	_inherits(InformedDecisionTreeNode, _DecisionTreeNode);

	function InformedDecisionTreeNode(_ref2) {
		var _ref2$action = _ref2.action;
		var action = _ref2$action === undefined ? null : _ref2$action;
		var _ref2$parent = _ref2.parent;
		var parent = _ref2$parent === undefined ? null : _ref2$parent;
		var _ref2$state = _ref2.state;
		var state = _ref2$state === undefined ? null : _ref2$state;
		var heuristic = _ref2.heuristic;

		_classCallCheck(this, InformedDecisionTreeNode);

		if (!(heuristic instanceof ConfigurableFunction)) throw new Error("heuristic is required parameter for InformedDecisionTreeNode constructor, must be instance of ConfigurableFunction class accepting state, returning optimistic cost to reach target");

		var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(InformedDecisionTreeNode).call(this, { action: action, parent: parent, state: state }));

		_this2.heuristic = heuristic;
		_this2.pathCost = parent ? parent.pathCost + action.cost(parent) : 0;
		_this2.targetEstimate = heuristic.apply(_this2.state);
		_this2.totalCostEstimate = _this2.pathCost + _this2.targetEstimate;
		return _this2;
	}

	_createClass(InformedDecisionTreeNode, [{
		key: "addChild",
		value: function addChild(action) {
			var node = new InformedDecisionTreeNode({ action: action, parent: this, heuristic: this.heuristic });
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
	}], [{
		key: "compareInformedDecisionTreeNodes",
		value: function compareInformedDecisionTreeNodes(a, b) {
			if (a.totalCostEstimate > b.totalCostEstimate) return 1;else if (a.totalCostEstimate < b.totalCostEstimate) return -1;
			return 0;
		}
	}]);

	return InformedDecisionTreeNode;
}(_findsolution.DecisionTreeNode);

// Ordered BFS queue by compare function


var HOBFS = function (_extendableBuiltin2) {
	_inherits(HOBFS, _extendableBuiltin2);

	function HOBFS(compareFn) {
		_classCallCheck(this, HOBFS);

		var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(HOBFS).call(this));

		_this3.compare = compareFn;
		return _this3;
	}

	_createClass(HOBFS, [{
		key: "push",
		value: function push() {
			var _get2;

			for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
				nodes[_key] = arguments[_key];
			}

			(_get2 = _get(Object.getPrototypeOf(HOBFS.prototype), "push", this)).call.apply(_get2, [this].concat(nodes));
			this.sort(this.compare);
			(0, _log.traceJSON)("HOBFS push: ", this.map(function (i) {
				return i.totalCostEstimate;
			}));
		}
	}, {
		key: "next",
		value: function next() {
			return this.shift();
		}
	}]);

	return HOBFS;
}(_extendableBuiltin(Array));

exports.findOptimalSolutionIBFS = findOptimalSolutionIBFS;
exports.InformedActionsTreeExpander = InformedActionsTreeExpander;
exports.ConfigurableFunction = ConfigurableFunction;
exports.default = findOptimalSolutionIBFS;