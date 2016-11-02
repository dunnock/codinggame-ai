var config = require("./config");
var animation = require("./track");

var vehiclesDefault = [];
for(var i=0, x=10630; i<config.numVehicles; i++, x+=800) {
	vehiclesDefault.push({   // TODO: change to something more universal
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

module.exports.init = (vehiclesInit = vehiclesDefault) => {
	vehicles = [...vehiclesInit];
	vehiclesTurns = (new Array(vehicles.length)).fill([]);
};

module.exports.podStep = (id, x, y, thrust) => {
	if(id<0 || id >= vehicles.length)
 		throw new Error("no such pod number " + id);  // id, xDirection, yDirection, thrust
	vehicles[id] = animation.calculatePodMoveToTarget(id, x, y, (thrust=="BOOST")?650:thrust);
	vehiclesTurns[id].push(vehicles[id]);
}

module.exports.podsCoords = () => {
	return vehicles;
}

module.exports.stepBack = () => {
 	vehicles = vehiclesTurns.map(vTurns => { vTurns.pop(); return vTurns.pop()} );
 	console.log(JSON.stringify(vehiclesTurns));
}
