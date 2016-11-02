require("babel-polyfill");

import BattleField from '../battlefield'
import Cell from '../cell'
import {predictOptions} from '../predictor'
import {InitBattleField, InitBattleFieldObject} from '../interfacetools'
import {trace, traceField, _TRACE, _DEBUG, traceJSON} from "../log"
import config from "../config"

let textField = [
	"..00.",
	".X0X.",
	".0..0",
	".X...",
	"..0.."
];
let entities = [
	{entityType: 0, owner: 0, x: 0, y: 0, param1: 1, param2: 3, myid: 0}
];

function checkTarget(cell) {
    return false;
}

let field = InitBattleField(textField);
entities.forEach(e => InitBattleFieldObject(Object.assign(e, {field})));
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
}
