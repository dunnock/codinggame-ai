require("babel-polyfill");

var printapi = require("./printapi");
var data = require("./data");
var config = require("./config");
var koa = require('koa');
var cors = require('koa-cors');
var router = require('koa-router')();
var jsonBody = require('koa-body');
var predict = require("./predictor")
var controller = require("./gamecontroller");

config.log_level = 0;

var app = koa();

var animation = require("./track"); 
animation.interface(data.readline, printapi.print, printapi.printErr);

app.use(cors({origin: 'http://localhost:3000'}));

router
	.get("/init_race", function *(){
		data.init();
		animation.init();
		animation.initPods();
		let track = animation.getTrack();
		this.body = JSON.stringify({
			checkpoints: track.checkpoints,
			laps: track.laps,
			pods: animation.getPods()
		});
	})
	.post("/init_race", jsonBody, function *(){
		this.accepts('application/json');
		console.log(this.request.body);
	  	data.init(this.request.body.checkpoints);
	  	animation.init();
	  	let track = animation.getTrack();
	  	this.body = JSON.stringify({
			checkpoints: track.checkpoints,
			laps: track.laps,
			pods: animation.getPods()
		});
	})
	.get("/turn", function *(){
	  	animation.turn();
	  	this.body = JSON.stringify({
			pods: animation.getPods()
		});
	})
	.get("/prev_turn", function *(){
	    controller.stepBack();
	  	animation.prev_turn();
	  	this.body = JSON.stringify({
				pods: animation.getPods()
			});
	})
	.get("/predict", function *(){
		let prediction = predict.predictOptions({pod: animation.getPods()[0], depth: 50});
		let predictionTree = prediction.result.root;
		let depth = 0;
		if(prediction.success) {
			markSuccessPath(prediction.result.node); //winning node of the search tree
			depth = prediction.result.node.depth;
		}
		this.body = JSON.stringify({
				pods: resultTreeToArray(predictionTree),
				depth: depth
			});
	});

app.use(router.routes());


function markSuccessPath(bottomNode) {
	for(let node=bottomNode; node.parent; node = node.parent)
		node.state.optimalRoute = true;
};

function resultTreeToArray(treeNode) {
	let node = Object.assign({}, treeNode.state, {depth: treeNode.depth, action: treeNode.action, pathCost: treeNode.pathCost, targetEstimate: treeNode.targetEstimate, totalCostEstimate: treeNode.totalCostEstimate});
	return [].concat.apply([node], treeNode.children.map(n => resultTreeToArray(n)));
};

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
  console.log("result: " + this.body)
});


app.listen(3030);

console.log('listening on port 3030');

//for(var turn=0; animation.turn() && turn < config.limitTurns; turn++) {
//	console.log("NEXT TURN " + turn);
//}

