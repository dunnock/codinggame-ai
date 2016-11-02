"use strict";

require("babel-polyfill");

var printapi = require("./printapi");
var data = require("./data");
var config = require("./config");
var koa = require('koa');
var cors = require('koa-cors');
var router = require('koa-router')();
var jsonBody = require('koa-body');
var predict = require("./predictor");
var controller = require("./gamecontroller");

config.log_level = 0;

var app = koa();

var animation = require("./track");
animation.interface(data.readline, printapi.print, printapi.printErr);

app.use(cors({ origin: 'http://localhost:3000' }));

router.get("/init_race", regeneratorRuntime.mark(function _callee() {
	var track;
	return regeneratorRuntime.wrap(function _callee$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					data.init();
					animation.init();
					animation.initPods();
					track = animation.getTrack();

					this.body = JSON.stringify({
						checkpoints: track.checkpoints,
						laps: track.laps,
						pods: animation.getPods()
					});

				case 5:
				case "end":
					return _context.stop();
			}
		}
	}, _callee, this);
})).post("/init_race", jsonBody, regeneratorRuntime.mark(function _callee2() {
	var track;
	return regeneratorRuntime.wrap(function _callee2$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					this.accepts('application/json');
					console.log(this.request.body);
					data.init(this.request.body.checkpoints);
					animation.init();
					track = animation.getTrack();

					this.body = JSON.stringify({
						checkpoints: track.checkpoints,
						laps: track.laps,
						pods: animation.getPods()
					});

				case 6:
				case "end":
					return _context2.stop();
			}
		}
	}, _callee2, this);
})).get("/turn", regeneratorRuntime.mark(function _callee3() {
	return regeneratorRuntime.wrap(function _callee3$(_context3) {
		while (1) {
			switch (_context3.prev = _context3.next) {
				case 0:
					animation.turn();
					this.body = JSON.stringify({
						pods: animation.getPods()
					});

				case 2:
				case "end":
					return _context3.stop();
			}
		}
	}, _callee3, this);
})).get("/prev_turn", regeneratorRuntime.mark(function _callee4() {
	return regeneratorRuntime.wrap(function _callee4$(_context4) {
		while (1) {
			switch (_context4.prev = _context4.next) {
				case 0:
					controller.stepBack();
					animation.prev_turn();
					this.body = JSON.stringify({
						pods: animation.getPods()
					});

				case 3:
				case "end":
					return _context4.stop();
			}
		}
	}, _callee4, this);
})).get("/predict", regeneratorRuntime.mark(function _callee5() {
	var prediction, predictionTree, depth;
	return regeneratorRuntime.wrap(function _callee5$(_context5) {
		while (1) {
			switch (_context5.prev = _context5.next) {
				case 0:
					prediction = predict.predictOptions({ pod: animation.getPods()[0], depth: 50 });
					predictionTree = prediction.result.root;
					depth = 0;

					if (prediction.success) {
						markSuccessPath(prediction.result.node); //winning node of the search tree
						depth = prediction.result.node.depth;
					}
					this.body = JSON.stringify({
						pods: resultTreeToArray(predictionTree),
						depth: depth
					});

				case 5:
				case "end":
					return _context5.stop();
			}
		}
	}, _callee5, this);
}));

app.use(router.routes());

function markSuccessPath(bottomNode) {
	for (var node = bottomNode; node.parent; node = node.parent) {
		node.state.optimalRoute = true;
	}
};

function resultTreeToArray(treeNode) {
	var node = Object.assign({}, treeNode.state, { depth: treeNode.depth, action: treeNode.action, pathCost: treeNode.pathCost, targetEstimate: treeNode.targetEstimate, totalCostEstimate: treeNode.totalCostEstimate });
	return [].concat.apply([node], treeNode.children.map(function (n) {
		return resultTreeToArray(n);
	}));
};

app.use(regeneratorRuntime.mark(function _callee6(next) {
	var start, ms;
	return regeneratorRuntime.wrap(function _callee6$(_context6) {
		while (1) {
			switch (_context6.prev = _context6.next) {
				case 0:
					start = new Date();
					_context6.next = 3;
					return next;

				case 3:
					ms = new Date() - start;

					console.log('%s %s - %s', this.method, this.url, ms);
					console.log("result: " + this.body);

				case 6:
				case "end":
					return _context6.stop();
			}
		}
	}, _callee6, this);
}));

app.listen(3030);

console.log('listening on port 3030');

//for(var turn=0; animation.turn() && turn < config.limitTurns; turn++) {
//	console.log("NEXT TURN " + turn);
//}