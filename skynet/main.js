/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

import {Skynet} from './skynet.js'
import predictOptions from './predictor.js'
import {traceJSON, _TRACE} from './log'
import config from "./config";
config.logger = printErr;

const depth = 10

var inputs = readline().split(' ');
var N = parseInt(inputs[0]); // the total number of nodes in the level, including the gateways
var L = parseInt(inputs[1]); // the number of links
var E = parseInt(inputs[2]); // the number of exit gateways

let net = new Skynet(N)

for (var i = 0; i < L; i++) {
    var inputs = readline().split(' ');
    var N1 = parseInt(inputs[0]); // N1 and N2 defines a link between these nodes
    var N2 = parseInt(inputs[1]);
    net.addLink(N1, N2)
}
for (var i = 0; i < E; i++) {
    var EI = parseInt(readline()); // the index of a gateway node
    net.addExit(EI)
}

// game loop
while (true) {
    var SI = parseInt(readline()); // The index of the node on which the Skynet agent is positioned this turn

    // Write an action using print()
    // To debug: printErr('Debug messages...');

    net.agent = SI

    let prediction = predictOptions({node: net.nodes[SI], depth})
    let node = prediction.result.node
    let answer = [node.state.id, node.parent.state.id]

    traceJSON(`Node cost ${node.cost} benefit ${node.benefit} score ${node.score} `, node.action, _TRACE)

    net.removeLink(...answer)
    node.parent.state.exits.delete(node.state)

    // Example: 0 1 are the indices of the nodes you wish to sever the link between
    print(answer.join(' '));
}