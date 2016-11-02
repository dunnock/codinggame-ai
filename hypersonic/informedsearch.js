// find solution via informed search
import { findOptimalSolution, DecisionTreeNode, ActionsTreeExpander } from './findsolution'
import {traceJSON, _TRACE} from "./log"



// Performs tree search going through nodes in the order defined by queue.
// Nodes in the tree expanded using TreeExpander class instance
//   initialState - starting point for the search
//   treeGen class instance of TreeExpander
//	 checkTarget function accepts node.state, should return true if search target achieved
//	 use queue DFS for Depth First Search, BFS is used by default
function findOptimalSolutionIBFS ({initialState, treeExpander, checkTarget, depthLimit, heuristic}) {
	var root = new InformedDecisionTreeNode({state: initialState, heuristic});
	var queue = new HOBFS(InformedDecisionTreeNode.compareInformedDecisionTreeNodes);
	queue.push(root);
	return findOptimalSolution({treeExpander, checkTarget, queue, depthLimit})
}


class ConfigurableFunction {
	apply() {}
}

// Node leafs represent states, branch is action.
// Action is transforming node into successor node.
// New ActionsTreeExpander([new SmartAction1(), new SmartAction2()])
class InformedActionsTreeExpander extends ActionsTreeExpander {
	constructor(actions) {
		super(actions);
	}
	expandNode(node) {
		return this.actions
//			.filter(action => action.isApplicable(node))
			.map(action => {
				traceJSON("exec action", action);
				return node.addChild(action)});
	}
}



// DecisionTree is a resulting tree structure with state and action stored
// adds two parameters to DecisionTreeNode:
//   	targetEstimate -- estimated cost to get to target state from the node (h(n) in CS)
//	    pathCost -- cost of the path to the node (g(n) in CS)
class InformedDecisionTreeNode extends DecisionTreeNode {
	constructor({action = null, parent = null, state = null, heuristic}) {
		if(!(heuristic instanceof ConfigurableFunction))
			throw new Error("heuristic is required parameter for InformedDecisionTreeNode constructor, must be instance of ConfigurableFunction class accepting state, returning optimistic cost to reach target");
		super({action, parent, state});
		this.heuristic = heuristic;
		this.pathCost = parent ? (parent.pathCost + action.cost(parent)) : 0;
		this.targetEstimate = heuristic.apply(this.state);
		this.totalCostEstimate = this.pathCost + this.targetEstimate;
	}
	addChild(action) {
		var node = new InformedDecisionTreeNode({action, parent: this, heuristic: this.heuristic})
		this.children.push(node);
		return node;
	}
	path() {
		if(this.depth == 0) return [ this ];
		let path = this.parent.path();
		path.push(this);
		return path;
	}
	static compareInformedDecisionTreeNodes (a, b) {
		if (a.totalCostEstimate > b.totalCostEstimate) 
			return 1;
		else if (a.totalCostEstimate < b.totalCostEstimate) 
			return -1;
		return 0;
	}
}

// Ordered BFS queue by compare function
class HOBFS extends Array {
	constructor(compareFn) {
		super();
		this.compare = compareFn;
	}
	push(...nodes) {
		super.push(...nodes);
		this.sort(this.compare);
		traceJSON("HOBFS push: ", this.map(i => i.totalCostEstimate));
	}
	next() {
		return this.shift()
	}
}

export { findOptimalSolutionIBFS, InformedActionsTreeExpander, ConfigurableFunction } ;
export default findOptimalSolutionIBFS;