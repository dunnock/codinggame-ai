require("babel-polyfill");

import {PredictOptionsTest} from "./testutils"
import config from "../config"

let textField = [
	".....",
	".X.X.",
	".....",
	".X.X.",
	"....."
]
let entities = [
	{entityType: 0, owner: 0, x: 0, y: 0, param1: 1, param2: 3, myid: 0},
	{entityType: 2, owner: 0, x: 1, y: 0, param1: 1, param2: 3, myid: 0},
	{entityType: 2, owner: 0, x: 0, y: 2, param1: 1, param2: 3, myid: 0},
	{entityType: 2, owner: 0, x: 0, y: 3, param1: 1, param2: 3, myid: 0}
]
let resultOK = [
  ". $ . . . ", // beware of the important " " at the end
  ". X . X . ",
  ". . . . . ",
  ".PX . X . ",
  ". . . . . "
 ]

if(PredictOptionsTest({textField, entities, resultOK, depth: 6}))
	console.log("test passed")
else
	throw "test failed"
