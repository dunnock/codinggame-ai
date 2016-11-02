// Module processing input

var controller = require("./gamecontroller");
var config = require("./config");

var vehicleId = 0;

module.exports.printErr = (s) => {
	console.log(s);
}

// client should output vehicles parameters one by one
// x y thrust
module.exports.print = (s) => {
	console.log(`Pod ${vehicleId} posted ${s}`)
	let params = s.split(" ");
	if(params[2] === "BOOST") params[2] = 650;
	controller.podStep(vehicleId, ...params);
	vehicleId = (vehicleId + 1) % config.numVehicles;
}