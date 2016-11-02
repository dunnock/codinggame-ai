require("babel-polyfill");

import config from "../config"
import {PredictOptionsTest} from "./testutils"

let textField = [
	"..0......",
	".X.X...X.",
	"0........",
	".X.X.X.X.",
	"........."
];
let entities = [
	{entityType: 0, owner: 0, x: 4, y: 0, param1: 4, param2: 6, myid: 0},
	{entityType: 2, owner: 0, x: 1, y: 2, param1: 1, param2: 0, myid: 0}
];
let resultOK = [
  ". . 6 ? * ? ? ? ? ",
  ". X . X ? . . X . ",
  "0 .P. . ? . . . . ",
  ". X . X ? X . X . ",
  ". . . . ? . . . . "
  ]

if(PredictOptionsTest({textField, entities, resultOK, depth: 8}))
	console.log("test passed")
else
	throw "test failed"

