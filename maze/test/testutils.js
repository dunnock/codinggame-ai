import MazeArena from '../maze'
import findPath from '../pathfinder'
import {trace, _TRACE, _DEBUG, traceJSON} from "../log"

function extractOptimalRoute(node) {
    let route = []
    while(node = node.optimalSuccessor)
        route.push(node)
    return route;
}

function extractParentChildRoute(node) {
    let route = [node]
    while(node = node.parent)
        route.push(node)
    route.pop()
    return route;
}

const FORMATACTION = (node) => `${node.action.name} ${node.action.cell.x} ${node.action.cell.y} cost ${node.cost}`

function PredictOptionsTest({textField, entities, resultOK, depth = 6, filter}) {
	let field = new MazeArena(textField, entities[0].x, entities[0].y, entities[1].x, entities[1].y)
	trace("Test for field: ", _TRACE)
	trace(field.toString(), _TRACE)

	let prediction = findPath(field, depth);

	trace(`result: ${prediction.success}`);

	let l = prediction.result.root.leaves();
	for(let leaf of prediction.result.root.leaves()) {
		trace(`LEAF depth ${leaf.depth} cost ${leaf.cost} benefit ${leaf.benefit} score ${leaf.score}`, _TRACE)
		trace(leaf.state.toString(), _TRACE);
		if( filter && filter(leaf) )
			extractParentChildRoute(leaf).forEach(node => { traceJSON(`ACTION ${FORMATACTION(node)}` , node.action, _TRACE); trace(node.state.toString(), _TRACE); });
	}

	if(prediction.success) {
		let node = prediction.result.node;
		trace(`\nWINNING PATH depth ${prediction.result.node.depth} cost ${prediction.result.node.cost} benefit ${prediction.result.node.benefit} score ${prediction.result.node.score}`, _TRACE)
		extractParentChildRoute(node).forEach(node => { traceJSON(`ACTION ${FORMATACTION(node)}`, node.action, _TRACE); trace(node.state.toString(), _TRACE); });

		return prediction.result // (prediction.result.node.state.toString() == resultOK) ? prediction.result : false;
	}
	return false;
}

export {PredictOptionsTest, extractParentChildRoute, extractOptimalRoute}
