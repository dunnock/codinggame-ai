import BattleField from '../battlefield'
import Cell from '../cell'
import {predictOptions} from '../predictor'
import {InitBattleField, InitBattleFieldObject, DeployBombs} from '../interfacetools'
import {trace, traceField, _TRACE, _DEBUG, traceJSON} from "../log"

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

const FORMATACTION = (node) => `${node.action.name} ${node.action.cell.x} ${node.action.cell.y} benefit ${node.benefit} ${node.reassigned?"reassigned":""}`

function PredictOptionsTest({textField, entities, resultOK, depth = 6, filter}) {
	let field = InitBattleField(textField)
	entities.forEach(e => InitBattleFieldObject(Object.assign(e, {field})))
	DeployBombs(field)
	trace("Test for field: ", _TRACE)
	traceField(field, _TRACE)

	let prediction = predictOptions({field, player: field.player, depth});

	trace(`result: ${prediction.success}`);

	let l = prediction.result.root.leaves();
	for(let leaf of prediction.result.root.leaves()) {
		trace(`LEAF depth ${leaf.depth} cost ${leaf.cost} benefit ${leaf.benefit} score ${leaf.score}`, _TRACE)
		if( filter && filter(leaf) )
			extractParentChildRoute(leaf).forEach(node => { traceJSON(`ACTION ${FORMATACTION(node)}` , node.action, _TRACE); traceField(node.state, _TRACE); });
	}

	if(prediction.success) {
		let node = prediction.result.root;
		trace(`\nWINNING PATH depth ${prediction.result.node.depth} cost ${prediction.result.node.cost} benefit ${prediction.result.node.benefit} score ${prediction.result.node.score}`, _TRACE)
		extractOptimalRoute(node).forEach(node => { traceJSON(`ACTION ${FORMATACTION(node)}`, node.action, _TRACE); traceField(node.state, _TRACE); });

		return prediction.result.node.state.toStrings().every((s, i) => s == resultOK[i]) ? prediction.result : false;
	}
	return false;
}

export {PredictOptionsTest, extractParentChildRoute, extractOptimalRoute}
