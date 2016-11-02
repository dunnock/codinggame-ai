require("babel-polyfill");

import config from "../config"
import {PredictOptionsTest} from "./testutils"

let textField = [
	"..0..",
	".X.X.",
	"0....",
	".....",
	"....."
]
let entities = [
	{entityType: 0, owner: 0, x: 0, y: 0, param1: 1, param2: 3, myid: 0},
	{entityType: 0, owner: 1, x: 4, y: 4, param1: 1, param2: 3, myid: 0},
	{entityType: 1, owner: 1, x: 4, y: 4, param1: 1, param2: 3, myid: 0}
]
let resultOK = [
  "? * 6 . . ",
  ".PX . X . ",
  "0 . . . ! ",
  ". . . . ! ",
  ". . ! ! @E"
]

if(PredictOptionsTest({textField, entities, resultOK, depth: 6}))
	console.log("Test passed")
else
	throw "Test failed, expected ==>\n" + resultOK.join("\n")

