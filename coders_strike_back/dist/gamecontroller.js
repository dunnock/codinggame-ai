"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var config = require("./config");
var animation = require("./track");

var vehiclesDefault = [];
for (var i = 0, x = 10630; i < config.numVehicles; i++, x += 800) {
	vehiclesDefault.push({ // TODO: change to something more universal
		x: x,
		y: 4474,
		vx: 9,
		vy: 509,
		angle: 120,
		nextCheckpointId: 2
	});
}

// Init vehicles
var vehicles;

var vehiclesTurns;

module.exports.init = function () {
	var vehiclesInit = arguments.length <= 0 || arguments[0] === undefined ? vehiclesDefault : arguments[0];

	vehicles = [].concat(_toConsumableArray(vehiclesInit));
	vehiclesTurns = new Array(vehicles.length).fill([]);
};

module.exports.podStep = function (id, x, y, thrust) {
	if (id < 0 || id >= vehicles.length) throw new Error("no such pod number " + id); // id, xDirection, yDirection, thrust
	vehicles[id] = animation.calculatePodMoveToTarget(id, x, y, thrust == "BOOST" ? 650 : thrust);
	vehiclesTurns[id].push(vehicles[id]);
};

module.exports.podsCoords = function () {
	return vehicles;
};

module.exports.stepBack = function () {
	vehicles = vehiclesTurns.map(function (vTurns) {
		vTurns.pop();return vTurns.pop();
	});
	console.log(JSON.stringify(vehiclesTurns));
};