/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

import findPath from "./pathfinder";
import { MazeArena } from "./maze";
import { traceJSON, _TRACE } from "./log";
import config from "./config";
config.logger = printErr;

const ARRAY = (n) => (new Array(n)).fill("");

var inputs = readline().split(' ');
var starty = parseInt(inputs[0]);
var startx = parseInt(inputs[1]);
var inputs = readline().split(' ');
var endy = parseInt(inputs[0]);
var endx = parseInt(inputs[1]);
var inputs = readline().split(' ');
var h = parseInt(inputs[0]);
var w = parseInt(inputs[1]);
var field = ARRAY(h).map(readline)

let maze = new MazeArena(field,startx,starty,endx,endy)
printErr(maze.toString())

let res = findPath(maze, 100)

for(let l of res.result.root.leaves()) printErr(l.state.toString())

print(res.result.node.cost)