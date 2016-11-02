require("babel-polyfill")

let benchmark  = require('birdpoo')

import config from "../config"
import {PredictOptionsTest, extractParentChildRoute} from "./testutils"

let textField = [
		"# # # # # # # # # # # # # # # # ",
		"# . + - .P# . . . . # . . . . # ",
		"# . + + + + . + + + + . + + . # ",
		"# . + . . + . + . . X . + . . # ",
		"# . | . + + X + . + + + + + + # ",
		"# . . . . X . + . # . . . . . # ",
		"# . + + + + . + X + + + + + . # ",
		"# . . . . + . . . + . . . . . # ",
		"# # + + + + + - . + + + + + # # ",
		"# . . . . . + . . . | . . . . # ",
		"# . + + + + + + + . . . + + # # ",
		"# . + . + . + . . . + . X .E. # ",
		"# . + X + . . . + . + . + + . # ",
		"# . | . + + + + + + - . . + . # ",
		"# . . . . . . . . . . # . . . # ",
		"# # # # # # # # # # # # # # # # "
	].map(r => r.split('').map((c,i)=>(i%2)?'':c).join(''))
let entities = [
		{x:4,y:1},
		{x:13,y:11}
	];
let resultOK = [
		"# # # # # # # # # # # # # # # # ",
		"# . + - . # . . . . # . . . . # ",
		"# . + + + + . + + + + . + + . # ",
		"# . + . . + . + . . X . + . . # ",
		"# . | . + + X + . + + + + + + # ",
		"# . . . . X . + . # . . . . . # ",
		"# . + + + + . + X + + + + + . # ",
		"# . . . . + . . . + . . . . . # ",
		"# # + + + + + - . + + + + + # # ",
		"# . . . . . + . . . | . . . . # ",
		"# . + + + + + + + . . . + + # # ",
		"# . + . + . + . . . + . X .P. # ",
		"# . + X + . . . + . + . + + . # ",
		"# . | . + + + + + + - . . + . # ",
		"# . . . . . . . . . . # . . . # ",
		"# # # # # # # # # # # # # # # # "
	].join('\n')

function match(object, template) {
//TODO
}

function filter(leaf) {
	return false
}

config.log_level = 1
let time = 10000

function countNodes(root) {
	return 1 + root.children.reduce((count, node) => (count + countNodes(node)), 0);
}

let depth = 0

let result = PredictOptionsTest({textField, entities, resultOK, depth, filter})

let tps = 0

console.log(`Performance test in progress for ${time} milliseconds. Please wait...`)

config.log_level = 0

benchmark(
		(next) => { PredictOptionsTest({textField, entities, resultOK: resultOK, depth}); next() },
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
				resultOK
			})
		});
