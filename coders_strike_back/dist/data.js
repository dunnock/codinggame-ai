"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var controller = require("./gamecontroller");
var config = require("./config");
var data;

/*const initDataDefault = [
		{x:5000, y:5000}, // TODO: change to something more universal
		{x:9755, y:6545},
		{x:10000, y:10000},
	];*/

var initDataDefault = [{ "x": 5443, "y": 2829 }, { "x": 10323, "y": 3386 }, { "x": 11200, "y": 5425 }, { "x": 7289, "y": 6650 }];

//const initDataDefault = [{"x":10222,"y":4935},{"x":6123,"y":2189},{"x":3031,"y":5208},{"x":6267,"y":7779},{"x":14097,"y":7741},{"x":13885,"y":1205}];

module.exports.init = function () {
	var trackData = arguments.length <= 0 || arguments[0] === undefined ? initDataDefault : arguments[0];
	var podData = arguments[1];

	data = [config.totalLaps, // number of laps should be defined in config.json
	trackData.length].concat(_toConsumableArray(trackData.map(function (_ref) {
		var x = _ref.x;
		var y = _ref.y;
		return x + " " + y;
	})));
	controller.init(podData);
};

module.exports.readline = function () {
	if (data.length === 0) data = convertPodToLine(controller.podsCoords());
	if (config.log) console.log("readline data: " + JSON.stringify(data));
	return data.shift();
};

function convertPodToLine(objArr) {
	return objArr.map(function (obj) {
		return obj.x + " " + obj.y + " " + obj.vx + " " + obj.vy + " " + obj.angle + " " + obj.nextCheckpointId;
	});
}

module.exports.init();