require("babel-polyfill");

import BattleField from '../battlefield'
import Cell from '../cell'
import {predictOptions} from '../predictor'
import {InitBattleField, InitBattleFieldObject, DeployBombs} from '../interfacetools'
import {trace, traceField, _TRACE, _DEBUG, traceJSON} from "../log"
import config from "../config"

let textField = [
	"..........",
	".X.X.XX.X.",
	"...X.X....",
	".X.X.XX.X.",
	"...XXX...."
];
let entities = [
	{entityType: 0, owner: 0, x: 4, y: 2, param1: 1, param2: 3, myid: 0},
	{entityType: 1, owner: 0, x: 4, y: 2, param1: 3, param2: 10, myid: 0},
	{entityType: 1, owner: 0, x: 4, y: 3, param1: 6, param2: 10, myid: 0}
];

function checkTarget(cell) {
    return false;
}

let field = InitBattleField(textField);
entities.forEach(e => InitBattleFieldObject(Object.assign(e, {field})));
DeployBombs(field)
trace("Test for field: ", _TRACE);
traceField(field, _TRACE);

let prediction = predictOptions({field, player: field.player, depth: 10, checkTarget});

trace(`result: ${prediction.success}`);

let l = prediction.result.root.leaves();
for(let leaf of prediction.result.root.leaves()) {
	trace(`\nLEAF depth ${leaf.depth} cost ${leaf.cost} benefit ${leaf.benefit}  score ${leaf.score}`, _TRACE)
	traceField(leaf.state, _TRACE)
}

if(prediction.success) {
	let node = prediction.result.node;
	trace(`\nWINNING PATH depth ${node.depth} cost ${node.cost} benefit ${node.benefit} score ${node.score}`, _TRACE)
	node.path().forEach(node => { traceJSON("ACTION", node.action, _TRACE); traceField(node.state, _TRACE); });
}// else  {
