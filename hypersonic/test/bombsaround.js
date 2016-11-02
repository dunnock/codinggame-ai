require("babel-polyfill");

import {PredictOptionsTest} from "./testutils"
import config from "../config"

let textField = [
	"..........",
	".X.X.XX.X0",
	"..........",
	".X.X.XX.X.",
	".........."
];
let entities = [
	{entityType: 0, owner: 0, x: 8, y: 2, param1: 1, param2: 6, myid: 0},
	{entityType: 0, owner: 1, x: 5, y: 2, param1: 1, param2: 6, myid: 0},
	{entityType: 1, owner: 1, x: 4, y: 2, param1: 7, param2: 6, myid: 0},
	{entityType: 1, owner: 0, x: 9, y: 3, param1: 5, param2: 6, myid: 0},
	{entityType: 1, owner: 0, x: 7, y: 4, param1: 1, param2: 6, myid: 0},
	{entityType: 1, owner: 0, x: 8, y: 2, param1: 8, param2: 6, myid: 0}
];
let resultOK = [
  ". . . . ? . . ! . . ",
  ". X . X ? X X ! X 6 ",
  ". ? ? ? * ?E? ! *P? ",
  ". X . X ? X X ! X * ",
  ". . ! ! ! ! ! @ ! ! "
  ];

if(PredictOptionsTest({textField, entities, resultOK, depth: 6}))
	console.log("test passed")
else
	throw "test failed"
