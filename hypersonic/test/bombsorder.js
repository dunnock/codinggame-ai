require("babel-polyfill");

import {PredictOptionsTest} from "./testutils"
import config from "../config"

let textField = [
	"..........",
	".X.X.XX.X.",
	"..........",
	".X.X.XX0X.",
	".........."
];
let entities = [
	{entityType: 0, owner: 0, x: 3, y: 2, param1: 1, param2: 3, myid: 0},
	{entityType: 1, owner: 0, x: 2, y: 2, param1: 6, param2: 4, myid: 0},
	{entityType: 1, owner: 0, x: 4, y: 1, param1: 8, param2: 4, myid: 0},
	{entityType: 1, owner: 0, x: 2, y: 0, param1: 2, param2: 4, myid: 0}
];
let resultOK = [
  "! ! @ ! ! ! . . . . ",
  ". X ! X * X X . X . ",
  "! ! @ ! ! ! . . . . ",
  ". X ! X ? X X 0 X . ",
  ". . ! . ? . . .P. . "
];

if(PredictOptionsTest({textField, entities, resultOK, depth: 6}))
	console.log("test passed")
else
	throw "test failed"
