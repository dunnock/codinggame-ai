"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Module processing input

var controller = require("./gamecontroller");
var config = require("./config");

var vehicleId = 0;

module.exports.printErr = function (s) {
	console.log(s);
};

// client should output vehicles parameters one by one
// x y thrust
module.exports.print = function (s) {
	console.log("Pod " + vehicleId + " posted " + s);
	var params = s.split(" ");
	if (params[2] === "BOOST") params[2] = 650;
	controller.podStep.apply(controller, [vehicleId].concat(_toConsumableArray(params)));
	vehicleId = (vehicleId + 1) % config.numVehicles;
};