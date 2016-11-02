/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

import { predictOptions } from "./predictor";
import { traceJSON, _TRACE } from "./log";
import config from "./config";
config.logger = printErr;

const ARRAY = (n) => new Array(n);

function countNodes(root) {
    return 1 + root.children.reduce((count, node) => (count + countNodes(node)), 0);
}


var inputs = readline().split(' ');
var width = parseInt(inputs[0]);
var height = parseInt(inputs[1]);
var myid = parseInt(inputs[2]);

let bombRadius = 3;
let bombsLeft = 1;

function extractOptimalRoute(node) {
    let route = []
    while(node = node.optimalSuccessor)
        route.push(node)
    return route;
}

let prevTarget, player;

import {InitBattleField, InitBattleFieldObject, DeployBombs} from './interfacetools'

// game loop
while (true) {
    let target;

    let benchmark = Date.now()

    // READ INPUT
    let textField = ARRAY(height).fill('').map(readline);
    let field = InitBattleField(textField);
    var entities = parseInt(readline());
    for (var i = 0; i < entities; i++) {
        var inputs = readline().split(' ');
        InitBattleFieldObject({
            field,
            entityType: parseInt(inputs[0]),
            owner: parseInt(inputs[1]),
            x: parseInt(inputs[2]),
            y: parseInt(inputs[3]),
            param1: parseInt(inputs[4]),
            param2: parseInt(inputs[5]),
            myid
        });
    }
    DeployBombs(field)

    player = field.player;

    let route = prevTarget ? prevTarget.route : undefined;
    printErr(route ? route.map(node => {
                let cur = node.state.player;
                return `${cur.x}:${cur.y}(${field.cell(cur).type}=${prevTarget.root.state.cell(cur).type}) ` } ).join(' ') : "ERR");

    // Validate and reset previous targets if not valid anymore
    if(prevTarget && route && !player.at(prevTarget.player) &&
                route.every(node => {
                    let cur = node.state.player;
                    let cell = field.cell(cur);
                    return cell.type == prevTarget.root.state.cell(cur).type && !cell.isEnemy() } ) )
    { 
        target = prevTarget;
        traceJSON(`prevTarget: `, prevTarget.player, _TRACE);
    } else {
        let res, node;
        res = predictOptions({field, depth: 7});
        if(res.success) 
            node = res.result.node
        else
            node = res.result.root
        target = node.state;
        target.route = route = extractRoute(res.result.root);
        target.root = res.result.root;
        prevTarget = target;

        traceJSON(`player: `, player, _TRACE);
        traceJSON(`target cost ${node.cost} benefit ${node.benefit} score ${node.score}: `, target.cell(target.player), _TRACE);
    }

    let action = "MOVE"
    if(route && route.length > 0) {
        route.forEach(n => traceJSON(`node action ${n.action.name} depth ${n.depth} benefit ${n.benefit}: `, n.state.cell(n.state.player), _TRACE))
        let node = target.route.shift()
        if(node.action.name == "Bomb") {
            action = "BOMB"
            if (route.length > 0)
                node = route.shift()
        }
        target = node.state
    }
    print(`${action} ${target.player.x} ${target.player.y} ${Date.now() - benchmark}ms ${countNodes(prevTarget.root)}`);
}