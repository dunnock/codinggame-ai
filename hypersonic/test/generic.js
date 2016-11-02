require("babel-polyfill")

let benchmark  = require('birdpoo')

import config from "../config"
import {PredictOptionsTest, extractParentChildRoute} from "./testutils"

let textField = [
	"..0.......0......",
	".X.X.X.X.X.X.X.X.",
	"......0..........",
	".X.X.X.X.X.X.X.X0",
	"..0..............",
	".X.X.X.X.X.X.X.X0",
	"..0.........0....",
	".X.X.X.X.X.X.X.X.",
	"..0..............",
	".X.X.X.X.X.X.X.X.",
	"......0..........",
	".X.X.X.X.X.X.X.X.",
	"......0..........",
	".X.X.X.X.X.X.X.X.",
	".....0.....0....."
];
let entities = [
	{entityType: 0, owner: 0, x: 8, y: 7, param1: 2, param2: 6, myid: 0},
	{entityType: 0, owner: 1, x: 4, y: 0, param1: 4, param2: 6, myid: 0},
	{entityType: 0, owner: 2, x: 4, y: 0, param1: 4, param2: 6, myid: 0},
	{entityType: 1, owner: 0, x: 4, y: 3, param1: 6, param2: 5, myid: 0},
	{entityType: 1, owner: 0, x: 11, y: 7, param1: 2, param2: 0, myid: 0},
	{entityType: 1, owner: 0, x: 0, y: 9, param1: 8, param2: 0, myid: 0},
	{entityType: 1, owner: 0, x: 12, y: 9, param1: 2, param2: 0, myid: 0},
	{entityType: 2, owner: 0, x: 1, y: 2, param1: 1, param2: 0, myid: 0},
	{entityType: 2, owner: 0, x: 5, y: 7, param1: 2, param2: 0, myid: 0},
	{entityType: 2, owner: 0, x: 7, y: 10, param1: 1, param2: 0, myid: 0},
	{entityType: 2, owner: 0, x: 11, y: 8, param1: 2, param2: 0, myid: 0}
];
let resultOK = {
6:[
  ". . 0 . ?E. . . . . 0 . . . . . . ",
  ". X . X ? X . X . X . X . X . X . ",
  ". $ . . ? . 6 . . . . . . . . . . ",
  ". X . X * X ? X . X . X . X . X 0 ",
  ". . 0 . ? . ? . . . . . . . . . . ",
  ". X . X ? X ? X . X . X . X . X 0 ",
  ". . 6 ? ? ? * ? ? ? ? ? 0 . . . . ",
  ". X . X ? .P? X . X . @ . X . X . ",
  ". . 0 . . . ? . . . . $ . . . . . ",
  "* X . X . X ? X . X . X @ X . X . ",
  ". . . . . . 6 $ . . . . . . . . . ",
  ". X . X . X . X . X . X . X . X . ",
  ". . . . . . 0 . . . . . . . . . . ",
  ". X . X . X . X . X . X . X . X . ",
  ". . . . . 0 . . . . . 0 . . . . . "
],
8:[
  ". . 0 . ?E. . . . . 0 . . . . . . ",
  ". X . X ? X . X . X . X . X . X . ",
  ". $ . . ? . 6 . . . . . . . . . . ",
  ". X . X * X ? X . X . X . X . X 0 ",
  ". . 0 . ? . ? . . . . . . . . . . ",
  ". X . X ? X ? X . X . X . X . X 0 ",
  ". . 6 ? ? ? ? * ? ? ? ? 6 . . . . ",
  ". X . X ? ? * X . X . @ . X . X . ",
  ". . 0 . . .P? . . . . $ . . . . . ",
  "* X . X . X ? X . X . X @ X . X . ",
  ". . . . . . 6 $ . . . . . . . . . ",
  ". X . X . X . X . X . X . X . X . ",
  ". . . . . . 0 . . . . . . . . . . ",
  ". X . X . X . X . X . X . X . X . ",
  ". . . . . 0 . . . . . 0 . . . . . "
/*
  ". . 0 . ?E. . . . . 0 . . . . . . ",
  ". X . X ? X . X . X . X . X . X . ",
  ". $ . . ? . 6 . . . . . . . . . . ",
  ". X . X * X ? X . X . X . X . X 0 ",
  ". . 0 . ? . ? . . . . . . . . . . ",
  ". X . X ? X ? X . X . X . X . X 0 ",
  ". . 6 ? ? ? * * ? ? ? ? 6 . . . . ",
  ". X . X ? . ? X . X . @ . X . X . ",
  ". . 0 . . .P? . . . . $ . . . . . ",
  "* X . X . X ? X . X . X @ X . X . ",
  ". . . . . . 6 $ . . . . . . . . . ",
  ". X . X . X . X . X . X . X . X . ",
  ". . . . . . 0 . . . . . . . . . . ",
  ". X . X . X . X . X . X . X . X . ",
  ". . . . . 0 . . . . . 0 . . . . . "*/
]
}

function match(object, template) {
//TODO
}

function filter(leaf) {
	return extractParentChildRoute(leaf).some(node => node.action && node.action.name == "Move" &&
				node.action.cell.x == 6 && node.action.cell.y == 6 && node.parent.state.playerCell().x == 7)
			 && leaf.state.cellXY(6,6).isBomb() && !leaf.state.cellXY(8,6).isBomb()
}

config.log_level = 1
let time = 10000

function countNodes(root) {
	return 1 + root.children.reduce((count, node) => (count + countNodes(node)), 0);
}

let depth = 8

let result = PredictOptionsTest({textField, entities, resultOK: resultOK[depth], depth, filter})

let tps = 0

console.log(`Performance test in progress for ${time} milliseconds. Please wait...`)

config.log_level = 0

benchmark(
		(next) => { PredictOptionsTest({textField, entities, resultOK: resultOK[depth], depth}); next() },
		{after: (next) => next(), before: (next) => next(), time}
	).then((res) => {
		console.log({
				date: new Date(),
				depth,
				leaves: [...result.root.leaves()].length,
				nodes: countNodes(result.root),
				performance: 1000/res,
				result: {
					depth: result.node.depth,
					benefit: result.node.benefit,
					cost: result.node.cost,
				},
				result: resultOK[depth]
			})
		});
