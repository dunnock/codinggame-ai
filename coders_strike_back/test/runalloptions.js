//require("babel-polyfill");

var co = require('co');

var MongoClient = require('mongodb-es6').MongoClient;

var printapi = require("../printapi");
var data = require("../data");
var predict = require("../predictor")
var animation = require("../track"); 
import Point from '../point';
import Vector from '../vector';
var config = require("../config");
config.log_level = 0;

const podExtraStats = (pod) => {
    let betweenCheckpointsAngle = Math.abs(pod.checkpoint1Angle - pod.checkpoint2Angle);
    let velocityCheckpointAngle =  pod.checkpoint1Angle - pod.velocity.angle();
    let orientationCheckpointAngle =  pod.checkpoint1Angle - pod.orientation.angle();

	return Object.assign(pod,
			{   betweenCheckpointsAngle: betweenCheckpointsAngle,
				velocityCheckpointAngle: velocityCheckpointAngle,
				orientationCheckpointAngle: orientationCheckpointAngle,
				velocityValue: pod.velocityValue
			 }
		)
	}

const prepareNode = (treeNode) =>
	 Object.assign({}, 
	 	podExtraStats(treeNode.state), 
	 	{	depth: treeNode.depth, 
	 		action: treeNode.action, 
	 		pathCost: treeNode.pathCost, 
	 		targetEstimate: treeNode.targetEstimate, 
	 		totalCostEstimate: treeNode.totalCostEstimate});

const countNodes = (treeNode) => { 
	let count = 1; 
	if(treeNode.children && treeNode.children.length) {
			for(let node of treeNode.children) {
				count += countNodes(node);
			}
		}
	return count;
}


animation.interface(data.readline, printapi.print, () => {});


function* podInitialData(x=5000, y=12000) {
	var pod = {
			x: x, 
			y: y,
			vx: 0,
			vy: 0,
			angle: 0,
			nextCheckpointId: 0
		};

	for(let a=0; a<360; a+=18)
		yield [Object.assign(pod, {angle: a})];
}

function* trackInitialData(scale) {
	let checkpoint1 = new Point(5000, 5000);
	let checkpoint2Vector = Vector._horizonVector.scale(scale);
	let checkpoint3 = new Point(10000, 10000);
	for(let a=0; a<360; a+=18, checkpoint2Vector = checkpoint2Vector.rotate(18)) {
		let checkpoint2 = checkpoint1.add(checkpoint2Vector);
		checkpoint2.angle = a;
		yield [checkpoint1, checkpoint2, checkpoint3];
	}
}

function* dataGen() {
	for(let podData of podInitialData(5000, 8000))
		for(let trackData of trackInitialData(50))
			yield {trackData, podData, scale: 50};

	for(let podData of podInitialData(5000, 16000))
		for(let trackData of trackInitialData(50))
			yield {trackData, podData, scale: 50};

	for(let podData of podInitialData(5000, 16000))
		for(let trackData of trackInitialData(100))
			yield {trackData, podData, scale: 100};
}

function podCheckpointsStats(podData, trackData) {
	let podToCheckpoint1 = new Vector(podData[0], trackData[0]);
	let podToCheckpoint2 = new Vector(podData[0], trackData[1]);
	let podOrientation = Vector._horizonVector.rotate(podData[0].angle);
	let checkpoint1ToCheckpoint2 = new Vector(trackData[0], trackData[1]);
	
	let res = {};
	res.podCheckpointsAngle = Math.round(podToCheckpoint1.angleTo(checkpoint1ToCheckpoint2));
	res.podBetweenCheckpointsAngle = Math.round(podToCheckpoint1.angleTo(podToCheckpoint2));
	res.orientationToCheckpointAngle = Math.round(podOrientation.angleTo(podToCheckpoint1));
	res.orientationPlusAngle = Math.abs(res.orientationToCheckpointAngle) + Math.abs(res.podCheckpointsAngle);
	res.checkpoint1Distance = Math.round(podToCheckpoint1.value());
	res.totalDistance = Math.round(res.checkpoint1Distance + checkpoint1ToCheckpoint2.value());
	return res;
}


co(function *() {
	var dbClient = yield new MongoClient('mongodb://localhost:27017/coders-stats', {}).connect();

	let series = Date.now();
	let experiment = 1;

	console.log("Starting series: " + series)


	for(let {trackData, podData, scale} of dataGen()) {
		console.log(`starting calculation with ${JSON.stringify(trackData)} ${JSON.stringify(podData)}`);
		data.init(trackData, podData);
		animation.init();
		animation.initPods();
		let startTime = Date.now();
		let prediction = predict.predictOptions({pod: animation.getPods()[0], depth: 50});
		let finishTime = Date.now();

		console.log(`
			************************
			result in ${finishTime-startTime}ms: ${prediction.success}`);

	//	if(prediction.success)
	//		prediction.result.node.path().forEach(node => console.log(JSON.stringify(prepareNode(node))));

		let result = yield dbClient['coders-stats']['experiments']
			.insertOne( {
					series: series,
					experiment: experiment++,
					trackData: trackData,
					pod1: podData[0],
					scale: scale,
					time: finishTime - startTime,
					treeSize: countNodes(prediction.result.root),
					stats: podCheckpointsStats(podData, trackData),
					success: prediction.success,
					depth: prediction.success ? prediction.result.node.depth : null,
					result: prediction.success ? prediction.result.node.path().map(node => prepareNode(node)) : null })

		console.log(`Saved to database ${result.result.n} records`);

	}

	dbClient.close();

	console.log("Finished series: " + series)

}).catch(function(err) {
	console.error(`Error ${err.stack}`);
})

