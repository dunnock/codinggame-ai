"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _extendableBuiltin5(cls) {
	function ExtendableBuiltin() {
		var instance = Reflect.construct(cls, Array.from(arguments));
		Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
		return instance;
	}

	ExtendableBuiltin.prototype = Object.create(cls.prototype, {
		constructor: {
			value: cls,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});

	if (Object.setPrototypeOf) {
		Object.setPrototypeOf(ExtendableBuiltin, cls);
	} else {
		ExtendableBuiltin.__proto__ = cls;
	}

	return ExtendableBuiltin;
}

function _extendableBuiltin3(cls) {
	function ExtendableBuiltin() {
		var instance = Reflect.construct(cls, Array.from(arguments));
		Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
		return instance;
	}

	ExtendableBuiltin.prototype = Object.create(cls.prototype, {
		constructor: {
			value: cls,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});

	if (Object.setPrototypeOf) {
		Object.setPrototypeOf(ExtendableBuiltin, cls);
	} else {
		ExtendableBuiltin.__proto__ = cls;
	}

	return ExtendableBuiltin;
}

function _extendableBuiltin(cls) {
	function ExtendableBuiltin() {
		var instance = Reflect.construct(cls, Array.from(arguments));
		Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
		return instance;
	}

	ExtendableBuiltin.prototype = Object.create(cls.prototype, {
		constructor: {
			value: cls,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});

	if (Object.setPrototypeOf) {
		Object.setPrototypeOf(ExtendableBuiltin, cls);
	} else {
		ExtendableBuiltin.__proto__ = cls;
	}

	return ExtendableBuiltin;
}

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/******/(function (modules) {
	// webpackBootstrap
	/******/ // The module cache
	/******/var installedModules = {};

	/******/ // The require function
	/******/function __webpack_require__(moduleId) {

		/******/ // Check if module is in cache
		/******/if (installedModules[moduleId])
			/******/return installedModules[moduleId].exports;

		/******/ // Create a new module (and put it into the cache)
		/******/var module = installedModules[moduleId] = {
			/******/exports: {},
			/******/id: moduleId,
			/******/loaded: false
			/******/ };

		/******/ // Execute the module function
		/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

		/******/ // Flag the module as loaded
		/******/module.loaded = true;

		/******/ // Return the exports of the module
		/******/return module.exports;
		/******/
	}

	/******/ // expose the modules object (__webpack_modules__)
	/******/__webpack_require__.m = modules;

	/******/ // expose the module cache
	/******/__webpack_require__.c = installedModules;

	/******/ // __webpack_public_path__
	/******/__webpack_require__.p = "";

	/******/ // Load entry module and return exports
	/******/return __webpack_require__(0);
	/******/
})(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, exports, __webpack_require__) {

	"use strict";

	//var printapi = require("./printapi");

	var config = __webpack_require__(1);
	var animation = __webpack_require__(2);

	config.logger = printErr;

	animation.interface(readline, print, printErr);

	animation.init(2, 2);

	while (true) {
		animation.turn();
	}

	/***/
},
/* 1 */
/***/function (module, exports) {

	"use strict";

	module.exports = {
		"numVehicles": 1,
		"totalLaps": 3,
		"limitTurns": 100,
		"log_level": 1
	};

	/***/
},
/* 2 */
/***/function (module, exports, __webpack_require__) {

	"use strict";

	var _pod = __webpack_require__(3);

	var _pod2 = _interopRequireDefault(_pod);

	var _point = __webpack_require__(5);

	var _point2 = _interopRequireDefault(_point);

	var _vector = __webpack_require__(4);

	var _vector2 = _interopRequireDefault(_vector);

	var _log = __webpack_require__(7);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}

	var config = __webpack_require__(1);

	var trackConfig = false;
	var boostUsed = false;

	var myPods, hisPods;

	var iface, readline, print, printErr;

	module.exports.interface = function (readlineF, printF, printErrF) {
		iface = {
			"readline": readlineF,
			"print": printF,
			"printErr": printErrF
		};
		var _iface = iface;
		readline = _iface.readline;
		print = _iface.print;
		printErr = _iface.printErr;
	};

	// EXPORT for external modules

	module.exports.init = GlobalInit;
	module.exports.initPods = readPods;

	function readPods() {
		myPods.forEach(function (pod) {
			return pod.read();
		});
		hisPods.forEach(function (pod) {
			return pod.read();
		});
	}

	// game loop
	module.exports.turn = function () {
		if (!trackConfig) throw new Error("Track.turn: Track not initialized");
		readPods();

		var target = new Array();
		target.push(myPods[0].optimalMoveAI(hisPods)); // {x:, y:, thrust:}

		for (var i = 1; i < myPods.length; i++) {
			target.push(myPods[i].pickOptimalTarget(hisPods).huntMove(myPods.slice(0, 1)));
		} // {x:, y:, thrust:}


		myPods.forEach(function (pod, i) {
			if (pod.collisionImpact(hisPods) > .25) target[i].thrust = "SHIELD";
		});

		/*
      traceJSON("Mypod[0].collisions ", myPods[0].collisions, _TRACE);
  
      if(myPods[0].collisions.some(i => i>2)) {
          let enemy = hisPods[myPods[0].collisions.findIndex(i => i>2)];
          myPods[1].attack(enemy);
          myPods[0].collisions = [];
          traceJSON("RED ALERT!!! Attack ", enemy, _TRACE);
      }
  */

		if (!boostUsed && Math.abs(myPods[0].checkpoint1Angle) < 15 && myPods[0].checkpoint1Distance > 8000) {
			target[0].thrust = "BOOST";
			boostUsed = true;
		}

		// You have to output the target position
		// followed by the power (0 <= thrust <= 100)
		// i.e.: "x y thrust"
		target.forEach(function (target) {
			return print(target.x + ' ' + target.y + ' ' + target.thrust);
		});

		//    print(target2.x + ' ' + target2.y + ' ' + target2.thrust);
		//    printErr("target turns: " + JSON.stringify(target));

		if (myPods[0].totalCheckpoints < trackConfig.totalCheckpointsLaps) return true;
	};

	module.exports.prev_turn = function () {
		if (!trackConfig) throw new Error("Game not initialized, cannot make prev_turn");
		myPods[0].read();
		printErr("prev_turn Pod 1: " + JSON.stringify(myPods));

		var target1 = myPods[0].optimalMove(); // {x:, y:, thrust:}

		// You have to output the target position
		// followed by the power (0 <= thrust <= 100)
		// i.e.: "x y thrust"
		print(target1.x + ' ' + target1.y + ' ' + target1.thrust);
		//    print(target2.x + ' ' + target2.y + ' ' + target2.thrust);
		printErr("target1 turn: " + JSON.stringify(target1));
	};

	module.exports.calculatePodMoveToTarget = function (podId, nx, ny, thrust) {
		var pod = myPods[podId];
		var intentVector = new _vector2.default(pod.position, new _point2.default(nx, ny));

		var res = pod.calculateMove(intentVector, thrust);
		var nextCheckpointId = pod.nextCheckpointId;
		if (trackConfig.checkpoints[nextCheckpointId].distance(res.position) < 600) nextCheckpointId = (nextCheckpointId + 1) % trackConfig.numCheckpoints;

		return Object.assign({ nextCheckpointId: nextCheckpointId }, res);
	};

	module.exports.shadowPodMoveToTarget = function (_ref) {
		var pod = _ref.pod;
		var x = _ref.x;
		var y = _ref.y;
		var thrust = _ref.thrust;

		var intentVector = new _vector2.default(pod.position, new _point2.default(x, y));

		var res = pod.calculateMove(intentVector, thrust);
		res.target = { x: x, y: y, thrust: thrust };
		var nextCheckpointId = pod.nextCheckpointId;
		if (trackConfig.checkpoints[nextCheckpointId].distance(res.position) < 500) nextCheckpointId = (nextCheckpointId + 1) % trackConfig.numCheckpoints;
		res.nextCheckpointId = nextCheckpointId;

		return pod.duplicateAndInit(res).updateCheckpoint();
	};

	module.exports.getTrack = function () {
		return trackConfig;
	};
	module.exports.getPods = function () {
		return myPods;
	};

	//// BELOW is a copy form codinggame


	//// General initialization

	function GlobalInit() {
		var numMyPods = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
		var numOpponentPods = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

		var laps = parseInt(readline());

		var checkpointsNum = parseInt(readline());
		var checkpoints = [];

		while (checkpointsNum--) {
			var inputs = readline().split(' ').map(toInt);
			checkpoints.push(new _point2.default(inputs[0], inputs[1]));
		}

		trackConfig = {
			laps: laps,
			checkpoints: checkpoints,
			numCheckpoints: checkpoints.length,
			totalCheckpointsLaps: laps * checkpoints.length
		};
		printErr("Initialized trackConfig: " + JSON.stringify(trackConfig));

		myPods = Array(numMyPods).fill(1).map(function (v, i) {
			return new _pod2.default(iface, trackConfig, -i);
		});
		hisPods = Array(numOpponentPods).fill(1).map(function (v, i) {
			return new _pod2.default(iface, trackConfig, i);
		});
		printErr("My pods: " + JSON.stringify(myPods));
	}

	function toInt(s) {
		return parseInt(s);
	}

	/***/
},
/* 3 */
/***/function (module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _vector = __webpack_require__(4);

	var _vector2 = _interopRequireDefault(_vector);

	var _point = __webpack_require__(5);

	var _point2 = _interopRequireDefault(_point);

	var _predictor = __webpack_require__(6);

	var _predictor2 = _interopRequireDefault(_predictor);

	var _log = __webpack_require__(7);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}

	var readline, printErr, trackConfig;

	var Pod = function () {
		// Pod functions

		function Pod(iface, track, id) {
			_classCallCheck(this, Pod);

			this.totalCheckpoints = 0;
			this.id = id;
			this.generation = 1;
			this.collisions = [];
			if (iface) {
				;
				readline = iface.readline;
				printErr = iface.printErr;
			}if (track) trackConfig = track;
		}

		_createClass(Pod, [{
			key: "read",
			value: function read() {
				var input = readline();

				var _input$split$map = input.split(' ').map(toInt);

				var _input$split$map2 = _slicedToArray(_input$split$map, 6);

				var x = _input$split$map2[0];
				var y = _input$split$map2[1];
				var vx = _input$split$map2[2];
				var vy = _input$split$map2[3];
				var a = _input$split$map2[4];
				var cid = _input$split$map2[5];
				//validate:

				if (typeof cid == "undefined") throw new Error("incorrect input string for Pod (no checkpoint): " + input);
				//init

				this.position = new _point2.default(x, y);
				this.velocity = new _vector2.default(new _point2.default(vx, vy));
				this.velocityValue = this.velocity.value();
				this.angleX = a;
				this.orientation = _vector2.default._horizonVector.rotate(this.angleX);
				this.nextCheckpointUpdated = this.nextCheckpointId != cid;
				this.nextCheckpointId = cid;
				this.updateCheckpoint();
				return this;
			}
		}, {
			key: "updateCheckpoint",
			value: function updateCheckpoint() {
				if (this.nextCheckpointUpdated) {
					this.checkpoint1 = trackConfig.checkpoints[this.nextCheckpointId];
					this.checkpoint1.id = this.nextCheckpointId;
					this.checkpoint2 = trackConfig.checkpoints[(this.nextCheckpointId + 1) % trackConfig.numCheckpoints];
					this.totalCheckpoints++;
					this.collisions = [];
				}
				this.checkpoint1Vector = new _vector2.default(this.position, this.checkpoint1);
				this.checkpoint1Distance = this.checkpoint1Vector.value();
				this.checkpoint1Angle = this.orientation.angleTo(this.checkpoint1Vector);
				this.checkpoint1VelocityAngleRad = this.checkpoint1Vector.angleToRad(this.velocity);
				this.checkpoint2Vector = new _vector2.default(this.position, this.checkpoint2);
				this.checkpoint2Distance = this.checkpoint2Vector.value();
				this.checkpoint2Angle = this.orientation.angleTo(this.checkpoint2Vector);
				return this;
			}
		}, {
			key: "duplicateAndInit",
			value: function duplicateAndInit(_ref2) {
				var position = _ref2.position;
				var vx = _ref2.vx;
				var vy = _ref2.vy;
				var angle = _ref2.angle;
				var nextCheckpointId = _ref2.nextCheckpointId;
				var target = _ref2.target;

				var velocity = new _vector2.default(new _point2.default(vx, vy));
				var pod = Object.assign(new Pod(false, false, this.id), {
					position: position,
					velocity: velocity,
					velocityValue: velocity.value(),
					angleX: angle,
					orientation: _vector2.default._horizonVector.rotate(angle),
					nextCheckpointId: nextCheckpointId,
					nextCheckpointUpdated: nextCheckpointId != this.nextCheckpointId,
					target: target,
					totalCheckpoints: this.totalCheckpoints,
					id: this.id,
					generation: this.generation + 1,
					checkpoint1: this.checkpoint1,
					checkpoint2: this.checkpoint2
				});
				return pod;
			}

			// return relative stats from pod to point {distance, angle, velocityAngle}

		}, {
			key: "relativeStats",
			value: function relativeStats(p) {
				var res = {};
				res.vector = new _vector2.default(this.position, p);
				res.distance = res.vector.value(); // distance to the point
				res.angle = res.vector.angleTo(this.orientation); //angleX is relative angle
				res.angleAbs = Math.abs(res.angle);
				res.angleVelocity = res.vector.angleTo(this.velocity);
				res.angleVelocityAbs = Math.abs(res.angleVelocity);

				return res;
			}

			// return relative stats from pod to point {distance, angle, velocityAngle}

		}, {
			key: "directionStats",
			value: function directionStats(p) {
				var res = {};
				res.vector = new _vector2.default(this.position, p);
				res.angle = res.vector.angleToRad(this.orientation); //angleX is relative angle

				return res;
			}

			// return relative stats from pod to point {distance, angle, velocityAngle}

		}, {
			key: "velocityStats",
			value: function velocityStats(p) {
				var res = {};
				res.vector = new _vector2.default(this.position, p);
				res.angle = res.vector.angleToRad(this.velocity); //angleX is relative angle
				res.velocityInDirection = this.velocityValue * Math.cos(res.angle);

				return res;
			}

			// calculated optimal direction and thrust of pod to move to the target Point
			// returns {x, y, thrust}

		}, {
			key: "aimToTarget",
			value: function aimToTarget(target) {
				var recommendedThrust = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

				var targStat = this.directionStats(target);
				var thrust = Math.abs(targStat.angle) > Math.PI / 2 ? 0 : recommendedThrust; // Math.round(100*Math.cos(cpAngleRad/6));

				//        if (!boostUsed && p1Stat.angleAbs < 10 && p1Stat.distance > 5000) {
				//            thrust = "BOOST";
				//            boostUsed = true;
				//        }

				return Object.assign({ thrust: thrust }, target);
			}
		}, {
			key: "aimToCheckpoint1",
			value: function aimToCheckpoint1() {
				var recommendedThrust = arguments.length <= 0 || arguments[0] === undefined ? 100 : arguments[0];

				var thrust = Math.abs(this.checkpoint1Angle) > 90 ? 0 : recommendedThrust; // Math.round(100*Math.cos(cpAngleRad/6));
				var target = this.checkpoint1;

				var angleVelocity = this.checkpoint1VelocityAngleRad * 180 / Math.PI;
				if (Math.abs(angleVelocity) < 90 && Math.abs(this.checkpoint1Angle) < 90) target = target.rotate(this.position, angleVelocity);

				return Object.assign({ thrust: thrust }, target);
			}
		}, {
			key: "distance",
			value: function distance(poi) {
				if (poi instanceof _point2.default) return this.position.distance(poi);else if (poi instanceof Pod) return this.position.distance(poi.position);
			}

			// calculated optimal direction and thrust of pod to move to the Point p1 
			// considering that after reaching p1 it has to move towards p2
			// returns {x: x, y: y, thrust: thrust}

		}, {
			key: "optimalMoveAI",
			value: function optimalMoveAI() {
				var hisPods = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

				if (this.enemy && this.runAwayFromEnemy()) return this.target;
				if (this.avoidCollision(hisPods, 5, false, this.checkpoint1Vector)) return this.target;
				if (this.velocityValue < 1000) {
					var res = (0, _predictor2.default)({ pod: this, depth: 50 });
					var node = res.result.node;
					if (node && node.parent) {
						this.target = node.path()[1].state.target;
						(0, _log.traceJSON)("optimalMoveAI (depth = " + node.depth + "): ", node.path()[1]);
						return this.target;
					}
				}
				this.target = this.optimalMove();
				return this.target;
			}
		}, {
			key: "runAwayFromEnemy",
			value: function runAwayFromEnemy() {
				if (!this.enemy) return false;
				var enemyVector = new _vector2.default(this.position, this.enemy.position);
				var angleEnemyToCheckpoint = enemyVector.angleTo(this.checkpoint1Vector);
				if (this.enemy.distance(this) > this.checkpoint1Distance || this.enemy.distance(this.checkpoint1) > this.checkpoint1Distance || Math.abs(angleEnemyToCheckpoint) < 60) return false;
				this.target = this.position.add(enemyVector.rotate(Math.sign(angleEnemyToCheckpoint) * 90));
				this.target.thrust = 200;
				return true;
			}

			// calculated optimal direction and thrust of pod to move to the Point p1 
			// considering that after reaching p1 it has to move towards p2
			// returns {x: x, y: y, thrust: thrust}

		}, {
			key: "optimalMove",
			value: function optimalMove() {
				var p1 = this.checkpoint1;
				var p2 = this.checkpoint2;
				(0, _log.traceJSON)("podOptimalMove: ", this);
				var p1Stat = this.relativeStats(p1);

				var thrust = 0;
				if (Math.abs(this.checkpoint1Angle) < 90 && this.velocityValue < 400 || Math.abs(this.checkpoint1Angle) < 45) thrust = 100;
				if (Math.abs(this.checkpoint1Angle) < 15 || Math.abs(this.checkpoint1Angle) < 60 && Math.abs(this.checkpoint1Angle) > 15 && Math.sign(this.checkpoint1Angle) != Math.sign(-this.checkpoint1VelocityAngleRad)) thrust = 200;

				var target = p1;

				var targStat = this.relativeStats(target);

				// patch target when far and moving in wrong direction
				if (targStat.angleVelocityAbs < 90 && targStat.angleAbs < 90) target = target.rotate(this.position, targStat.angleVelocity);

				//        if (!boostUsed && p1Stat.angleAbs < 10 && p1Stat.distance > 5000) {
				//            thrust = "BOOST";
				//            boostUsed = true;
				//        }

				this.target = Object.assign({ thrust: thrust }, target);

				return this.target;
			}
		}, {
			key: "avoidCollision",
			value: function avoidCollision() {
				var hisPods = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
				var steps = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

				var _this = this;

				var allCollisions = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
				var intentVec = arguments[3];

				if (!hisPods.length) return false;
				if (!intentVec) intentVec = this.velocity;
				var pods = hisPods.map(function (pod) {
					return { pod: pod, angle: pod.velocity.angleTo(intentVec) };
				});
				if (!allCollisions) pods = pods.filter(function (i) {
					return Math.abs(i.angle) > 60;
				});
				var positions = [];
				var myPos = [].concat(_toConsumableArray(this.extrapolatePositions(steps)));
				pods.map(function (podR) {
					return [].concat(_toConsumableArray(podR.pod.extrapolatePositions(steps))).map(function (position, i) {
						return { i: i, position: position, pod: podR.pod, angle: podR.angle,
							distance: position.distance(myPos[i]) };
					});
				}).forEach(function (podsR) {
					return positions.push.apply(positions, _toConsumableArray(podsR));
				});
				var collisions = positions.filter(function (i) {
					return i.distance < 800;
				}).filter(function (i) {
					return i.position.distance(_this.position) < _this.checkpoint1Distance - 200;
				});
				(0, _log.traceJSON)("avoidCollision positions distances [" + steps + "]", positions.map(function (i) {
					return i.distance;
				}));
				if (collisions.length) {
					var intersectAngle = collisions[0].angle;
					var angle = -Math.sign(intersectAngle) * 90;
					(0, _log.traceJSON)("avoidCollision velocitiesAngle " + intersectAngle + " rotate by ", angle, _log._TRACE);
					var thrust = 200;
					if (this.checkpoint1Distance < 1500) thrust = 50;
					this.target = this.position.add(this.orientation.scale(100).rotate(angle));
					this.target.thrust = thrust;
					return true;
				}
				return false;
			}
		}, {
			key: "huntMove",
			value: function huntMove() {
				var friendlyPods = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

				if (this.superAim) return Object.assign({ thrust: 200 }, this.huntCalcTarget(this.superAim));
				if (!this.aim) return Object.assign({ thrust: 200 }, this.checkpoint2);
				var target;
				var thrust = 200;
				var targetPod = this.aim;
				(0, _log.traceJSON)("hunting target ", targetPod);
				var targetDistance = this.position.distance(targetPod.position);
				//TODO: avoid hitting own pod
				if (friendlyPods.length) {
					if (this.avoidCollision(friendlyPods, 7, true)) return Object.assign(this.target, { thrust: 50 });else if (this.position.distance(friendlyPods[0].position) < 1000) thrust = 50;
				}

				if (targetDistance < 1400) // attack!!!
					target = targetPod.position;else if (this.isMovingTowardsMe(targetPod)) target = this.huntCalcTarget(targetPod);else {
					target = targetPod.checkpoint2;
					if (this.distance(target) < 3000) {
						target = targetPod.checkpoint1;thrust = 0;
					} else if (this.distance(target) < 6000) {
						thrust = 100;
					}
				}
				//    printErr("turns to target: " + Math.ceil(targetDistance/(targetPod.velocity.value+1)) + " velocity " + targetPod.velocity.value);
				return Object.assign({ thrust: thrust }, target);
			}
		}, {
			key: "huntCalcTarget",
			value: function huntCalcTarget(targetPod) {
				var tStat = this.relativeStats(targetPod.position);
				var target = targetPod.position;
				if (tStat.distance > 1400) {
					target = targetPod.extrapolatePosition(Math.round(tStat.distance / 2 / (targetPod.velocityValue + 1)));
					if (tStat.distance > 3000 && tStat.angleVelocityAbs < 90) target = target.rotate(this.position, tStat.angleVelocity);else if (tStat.distance > 3000 && tStat.angleVelocityAbs < 120) target = target.rotate(this.position, tStat.angleVelocity / 2);
				}
				return target;
			}
		}, {
			key: "extrapolatePosition",
			value: function extrapolatePosition(turns) {
				var intentVector = new _vector2.default(this.position, this.checkpoint1);

				var accelerationImpact = (1 + turns) * turns / 2 * Math.pow(.85, turns - 1);

				return this.position.add(this.velocity.scale(turns)).add(intentVector.scale(accelerationImpact / intentVector.value() * 30)) //add thrust approximation
				.add(this.orientation.scale(accelerationImpact * 1.2)); //add orientation approximation
			}
		}, {
			key: "extrapolatePositions",
			value: regeneratorRuntime.mark(function extrapolatePositions(turns) {
				var position, velocity, thrust, i;
				return regeneratorRuntime.wrap(function extrapolatePositions$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								position = this.position;
								velocity = this.velocity;
								thrust = this.orientation.scale(2); // consider thrust 100

								i = turns;

							case 4:
								if (!i--) {
									_context.next = 11;
									break;
								}

								velocity = velocity.add(thrust);
								_context.next = 8;
								return position = position.add(velocity);

							case 8:
								velocity = velocity.scale(0.85);
								_context.next = 4;
								break;

							case 11:
							case "end":
								return _context.stop();
						}
					}
				}, extrapolatePositions, this);
			})
		}, {
			key: "isMovingTowardsMe",
			value: function isMovingTowardsMe(pod) {
				var intentVector = new _vector2.default(pod.position, pod.checkpoint1);
				return Math.abs(intentVector.angleTo(new _vector2.default(pod.position, this.position))) < 60;
			}

			// returns collision impact 0-1, 0 for no collision, 1 for strongest

		}, {
			key: "collisionImpact",
			value: function collisionImpact(pods) {
				for (var i in pods) {
					var pod = pods[i];
					var collisionDistance = this.position.add(this.velocity).add(this.orientation).distance(pod.position.add(pod.velocity).add(pod.orientation));
					if (collisionDistance < 800) {
						var impact = (800 - collisionDistance) / 800 * Math.abs(this.velocity.angleTo(pod.velocity)) / 45;
						(0, _log.traceJSON)("Collision distance: " + collisionDistance + " impact " + impact, pod);
						this.collisions[pod.id] = this.collisions[pod.id] ? this.collisions[pod.id] + 1 : 1;
						if (this.collisions[pod.id] > 4) {
							(0, _log.traceJSON)("RED ALERT!!! Avoid ", pod, _log._TRACE);
							this.avoidEnemy(pod);
						}
						return impact;
					}
				}

				return 0;
			}
		}, {
			key: "avoidEnemy",
			value: function avoidEnemy(pod) {
				this.enemy = pod;
			}

			//pick the leader for chasing

		}, {
			key: "pickOptimalTarget",
			value: function pickOptimalTarget(pods) {
				if (this.superAim) {
					this.aim = this.superAim;return this;
				}
				var aim = this.aim;
				if (!aim) aim = pods[0];
				for (var i in pods) {
					if (pods[i].totalCheckpoints > aim.totalCheckpoints) aim = pods[i];
				}if (this.aim && this.distance(this.aim) < 2000 && this.aim.totalCheckpoints > aim.totalCheckpoints - 1) return this;

				this.aim = aim;
				printErr("Pick target: " + JSON.stringify(this.aim));
				return this;
			}
		}, {
			key: "attack",
			value: function attack(enemyPod) {
				if (!this.superAim) this.superAim = enemyPod;
			}
		}, {
			key: "calculateMove",
			value: function calculateMove(intentVector, thrust) {
				var intentAngle = Math.round(intentVector.angle());
				var angle = intentAngle - this.angleX; // Angle might change by 18
				if (angle > 180) angle -= 360;
				if (angle < -180) angle += 360;
				if (angle > 18) angle = 18;else if (angle < -18) angle = -18;
				angle += this.angleX;
				angle %= 360;
				if (angle < 0) angle += 360;

				//        printErr(`calculateMove position ${JSON.stringify(this.position)} intent ${JSON.stringify(intentVector)} intentAngle ${intentAngle} angle ${angle} this.angleX ${this.angleX}`);

				var thrustVector = _vector2.default._horizonVector.rotate(angle).scale(thrust / 100);

				var velocity = this.velocity.add(thrustVector);
				var position = this.position.add(velocity);
				velocity = velocity.scale(.85);

				return {
					x: position.x,
					y: position.y,
					vx: velocity.x,
					vy: velocity.y,
					angle: angle,
					position: position
				};
			}
		}, {
			key: "similar",
			value: function similar(pod) {
				return pod.position.distance(this.position) < 100 && pod.velocity.angleTo(this.velocity) < 1;
			}
		}]);

		return Pod;
	}();

	function toInt(s) {
		return parseInt(s);
	}

	exports.default = Pod;

	/***/
},
/* 4 */
/***/function (module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _point = __webpack_require__(5);

	var _point2 = _interopRequireDefault(_point);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}

	var _degreeToRadians = 180 / Math.PI;

	var Vector = function () {
		// Note: vector might have float coordinates
		function Vector(p1, p2) {
			_classCallCheck(this, Vector);

			if (!p2) {
				this.x = p1.x;
				this.y = p1.y;
			} else {
				this.x = p2.x - p1.x;
				this.y = p2.y - p1.y;
			}
		}

		_createClass(Vector, [{
			key: "add",
			value: function add(v) {
				return new Vector(new _point2.default(this.x + v.x, this.y + v.y));
			}
		}, {
			key: "scale",
			value: function scale(s) {
				return new Vector(new _point2.default(this.x * s, this.y * s));
			}
		}, {
			key: "rotate",
			value: function rotate(angle) {
				var angleRad = angle / _degreeToRadians;
				var rotatedX = this.x * Math.cos(angleRad) - this.y * Math.sin(angleRad);
				var rotatedY = this.x * Math.sin(angleRad) + this.y * Math.cos(angleRad);
				return new Vector(new _point2.default(rotatedX, rotatedY));
			}
		}, {
			key: "angleTo",
			value: function angleTo(v2) {
				var angleV1 = Math.atan2(-this.y, this.x);
				var angleV2 = Math.atan2(-v2.y, v2.x);

				var delta = angleV2 - angleV1;
				if (delta > Math.PI) delta -= Math.PI * 2;else if (delta < -Math.PI) delta += Math.PI * 2;

				return delta * _degreeToRadians;
			}
		}, {
			key: "angleToRad",
			value: function angleToRad(v2) {
				var angleV1 = Math.atan2(-this.y, this.x);
				var angleV2 = Math.atan2(-v2.y, v2.x);

				var delta = angleV2 - angleV1;
				if (delta > Math.PI) delta -= Math.PI * 2;else if (delta < -Math.PI) delta += Math.PI * 2;

				return delta;
			}
		}, {
			key: "angle",
			value: function angle() {
				var angle = Math.atan2(-this.y, this.x);
				if (angle > 0) angle = 2 * Math.PI - angle;else if (angle < 0) angle *= -1;

				return angle * _degreeToRadians;
			}
		}, {
			key: "value",
			value: function value() {
				return Math.hypot(this.x, this.y);
			}
		}]);

		return Vector;
	}();

	// Unfortunately ES6 does not support static members of the class, workaround:


	Vector._horizonVector = new Vector(new _point2.default(100, 0));

	exports.default = Vector;

	/***/
},
/* 5 */
/***/function (module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var _degreeToRadians = 180 / Math.PI;

	var Point = function () {

		// Point always has integer coordinates
		function Point(x, y) {
			_classCallCheck(this, Point);

			this.x = x;
			this.y = y;
		}

		_createClass(Point, [{
			key: "add",
			value: function add(v) {
				return new Point(this.x + Math.round(v.x), this.y + Math.round(v.y));
			}
		}, {
			key: "rotate",
			value: function rotate(around, angle) {
				var normalizedX = this.x - around.x;
				var normalizedY = this.y - around.y;
				var angleRad = angle / _degreeToRadians;
				var rotatedX = normalizedX * Math.cos(angleRad) - normalizedY * Math.sin(angleRad) + around.x;
				var rotatedY = normalizedX * Math.sin(angleRad) + normalizedY * Math.cos(angleRad) + around.y;

				return new Point(Math.round(rotatedX), Math.round(rotatedY));
			}
		}, {
			key: "distance",
			value: function distance(p2) {
				return Math.hypot(this.x - p2.x, this.y - p2.y);
			}
		}, {
			key: "angle",
			value: function angle() {
				var angle = Math.atan2(-this.y, this.x);
				if (angle > 0) angle = 2 * Math.PI - angle;else if (angle < 0) angle *= -1;

				return angle * _degreeToRadians;
			}
		}]);

		return Point;
	}();

	// Unfortunately ES6 does not support static members of the class, workaround:


	Point._zeroPoint = new Point(0, 0);

	exports.default = Point;

	/***/
},
/* 6 */
/***/function (module, exports, __webpack_require__) {

	"use strict";

	var _marked = [angle, acceleration, velocity, distance].map(regeneratorRuntime.mark);

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _pod = __webpack_require__(3);

	var _pod2 = _interopRequireDefault(_pod);

	var _vector = __webpack_require__(4);

	var _vector2 = _interopRequireDefault(_vector);

	var _point = __webpack_require__(5);

	var _point2 = _interopRequireDefault(_point);

	var _log = __webpack_require__(7);

	var _findsolution = __webpack_require__(8);

	var _informedsearch = __webpack_require__(9);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}

	var loop = __webpack_require__(2);

	module.exports.predictOptions = predictOptions;

	function predictOptions(_ref3) {
		var pod = _ref3.pod;
		var _ref3$depth = _ref3.depth;
		var depth = _ref3$depth === undefined ? 50 : _ref3$depth;

		(0, _log.traceJSON)("predictOptions ", arguments);
		var res = (0, _informedsearch.findOptimalSolutionIBFS)({
			initialState: pod,
			treeExpander: new PodActions(pod.checkpoint1, pod.checkpoint2),
			checkTarget: checkTarget.bind({ target: pod.checkpoint2 }),
			heuristic: new PodEstimateTarget(pod.position, pod.checkpoint1, pod.checkpoint2),
			depthLimit: depth
		});
		return res;
	}

	//IMPLEMENT class actions:

	function checkTarget(pod) {
		return pod.position.distance(this.target) < 600;
	}

	// Heuristic function with configuration stored

	var PodEstimateTarget = function (_informedsearch$Confi) {
		_inherits(PodEstimateTarget, _informedsearch$Confi);

		function PodEstimateTarget(pos, p1, p2) {
			_classCallCheck(this, PodEstimateTarget);

			var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(PodEstimateTarget).call(this));

			_this2.p1 = p1;
			_this2.p2 = p2;
			var angleCP2 = new _vector2.default(p1, p2).angleToRad(new _vector2.default(pos, p1));
			_this2.stepsToP2 = stepsToPoint(200 / .15, angleCP2, p1, p2);
			return _this2;
		}

		_createClass(PodEstimateTarget, [{
			key: "apply",
			value: function apply(pod) {
				var passedCheckpoint1 = pod.nextCheckpointId != this.p1.id;
				//		const podToPoint = (p1, p2) => Math.max((p1.distance(p2) - 600) / 1300, 0)
				if (!passedCheckpoint1) {
					return podStepsToPoint(pod, this.p1) - 4 + this.stepsToP2; //podToPoint(pod.position, this.p1); 
				} else {
					return podStepsToPoint(pod, this.p2); // podToPoint(pod.position, this.p2);
				}
			}
		}]);

		return PodEstimateTarget;
	}(_informedsearch.ConfigurableFunction);

	// On every state (pod position) search will try following actions, 
	// branching search until it reaches target


	var PodActions = function (_findsolution$Actions) {
		_inherits(PodActions, _findsolution$Actions);

		function PodActions(p1, p2) {
			_classCallCheck(this, PodActions);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(PodActions).call(this, [new MoveToCheckpoint1({ p1: p1, p2: p2, thrust: 100 }), new MoveToCheckpoint1({ p1: p1, p2: p2, thrust: 200 }),
			//				new MoveToCheckpoint1Compensate({p1, p2, thrust: 200}),
			//				new MoveViaCheckpoint1({p1, p2, distance: 400, thrust: 100}),
			//				new MoveViaCheckpoint1({p1, p2, distance: 400, thrust: 200}),
			new MoveToCheckpoint2({ p1: p1, p2: p2, thrust: 0 }),
			//				new MoveToCheckpoint2({p1, p2, thrust: 50}),
			new MoveToCheckpoint2({ p1: p1, p2: p2, thrust: 200 }), new MoveToCheckpoint2({ p1: p1, p2: p2, thrust: 100 })]));
		}

		return PodActions;
	}(_findsolution.ActionsTreeExpander);

	// Targetting pod directly to checkpoint1, until turned to checkpoint2


	var MoveToCheckpoint1 = function (_findsolution$SmartAc) {
		_inherits(MoveToCheckpoint1, _findsolution$SmartAc);

		function MoveToCheckpoint1(_ref4) {
			var p1 = _ref4.p1;
			var p2 = _ref4.p2;
			var _ref4$thrust = _ref4.thrust;
			var thrust = _ref4$thrust === undefined ? 100 : _ref4$thrust;

			_classCallCheck(this, MoveToCheckpoint1);

			var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(MoveToCheckpoint1).call(this, { p1: p1, p2: p2, thrust: thrust }));

			_this4.name = "MoveToCheckpoint1";
			return _this4;
		}

		_createClass(MoveToCheckpoint1, [{
			key: "apply",
			value: function apply(node) {
				var pod = node.state;
				var aim;

				/*        let angleVelocity = -pod.checkpoint1VelocityAngleRad * 180 / Math.PI;
            if(Math.abs(angleVelocity) > 45 && pod.checkpoint1Distance > 2000
            	&& pod.velocity.value() > 400 ) 
            	aim = pod.aimToCheckpoint1(this.thrust);
            else*/
				aim = pod.aimToTarget(this.p1, this.thrust);

				return loop.shadowPodMoveToTarget(Object.assign({ pod: pod }, aim));
			}
		}, {
			key: "isApplicable",
			value: function isApplicable(node) {
				if (!node.action) return true;
				if (!this.isCompatible(node.action)) return false;
				if (this.thrust < node.action.thrust) return false;
				var pod = node.state;
				if (pod.nextCheckpointId != this.p1.id) return false;
				if (this.thrust == 200 && Math.abs(pod.checkpoint1Angle) > 30) return false;
				return goesOffCheckpoint1(node.parent) ? true : !goesOffCheckpoint1(node);
			}
		}, {
			key: "isCompatible",
			value: function isCompatible(action) {
				return action.name == this.name;
			}
		}]);

		return MoveToCheckpoint1;
	}(_findsolution.SmartAction);

	// Targetting pod near checkpoint1, to optimize turn to checkpoint2


	var MoveViaCheckpoint1 = function (_MoveToCheckpoint) {
		_inherits(MoveViaCheckpoint1, _MoveToCheckpoint);

		function MoveViaCheckpoint1(_ref5) {
			var p1 = _ref5.p1;
			var p2 = _ref5.p2;
			var _ref5$distance = _ref5.distance;
			var distance = _ref5$distance === undefined ? 600 : _ref5$distance;
			var _ref5$thrust = _ref5.thrust;
			var thrust = _ref5$thrust === undefined ? 100 : _ref5$thrust;

			_classCallCheck(this, MoveViaCheckpoint1);

			var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(MoveViaCheckpoint1).call(this, { p1: p1, p2: p2, thrust: thrust }));

			_this5.distance = distance;
			_this5.name = "MoveViaCheckpoint1";
			_this5.P1P2 = new _vector2.default(_this5.p1, _this5.p2);
			return _this5;
		}

		_createClass(MoveViaCheckpoint1, [{
			key: "apply",
			value: function apply(node) {
				var pod = node.state;
				var podTarget = new _vector2.default(pod.position, this.p1);
				var angle = podTarget.angleTo(this.P1P2);
				var shiftVector = podTarget.rotate(90 * Math.sign(angle)).scale(this.distance / podTarget.value());
				//		console.log(`MoveViaCheckpoint1 angle ${angle} shift ${JSON.stringify(shiftVector)}`);
				var aim = pod.aimToTarget(this.p1.add(shiftVector), this.thrust);

				return loop.shadowPodMoveToTarget(Object.assign({ pod: pod }, aim));
			}
		}]);

		return MoveViaCheckpoint1;
	}(MoveToCheckpoint1);

	var MoveToCheckpoint2 = function (_findsolution$SmartAc2) {
		_inherits(MoveToCheckpoint2, _findsolution$SmartAc2);

		function MoveToCheckpoint2(_ref6) {
			var p1 = _ref6.p1;
			var p2 = _ref6.p2;
			var _ref6$thrust = _ref6.thrust;
			var thrust = _ref6$thrust === undefined ? 100 : _ref6$thrust;

			_classCallCheck(this, MoveToCheckpoint2);

			var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(MoveToCheckpoint2).call(this, { p1: p1, p2: p2, thrust: thrust }));

			_this6.actionSteps = 3 + (200 - _this6.thrust) / 50;
			_this6.name = "MoveToCheckpoint2";
			return _this6;
		}

		_createClass(MoveToCheckpoint2, [{
			key: "apply",
			value: function apply(node) {
				var pod = node.state;
				//let aim = pod.aimToTarget(this.p2, this.thrust);
				//		return loop.shadowPodMoveToTarget(Object.assign({pod}, aim));
				var passedCheckpoint1 = pod.nextCheckpointId != this.p1.id;
				var target = Object.assign({}, this.p2, { thrust: this.thrust });
				if (passedCheckpoint1) {
					target = pod.aimToCheckpoint1(this.thrust);
					// pod.checkpoint1 is this.p2 -- target checkpoint of this action
					/*	        let angleToVelocity = pod.checkpoint1VelocityAngleRad * 180 / Math.PI;
     	        // patch target when far and moving in wrong direction
     	        if(Math.abs(angleToVelocity) < 90 && Math.abs(pod.checkpoint1Angle) < 90 && pod.checkpoint1Distance > 2000) 
     	            target = target.rotate(pod.position, angleToVelocity);*/
				}
				return loop.shadowPodMoveToTarget(Object.assign({ pod: pod }, target));
			}
		}, {
			key: "isApplicable",
			value: function isApplicable(node) {
				var pod = node.state;
				if (pod.velocity.value() < 100 && this.thrust == 0) return false;
				//		if (passedCheckpoint1) 
				//			return this.thrust == 200; // After checkpoint1 allow only full thrust
				if (pod.nextCheckpointId == this.p1.id && node.parent && goesOffCheckpoint1(node)) return false;
				// Further it can continue only with the same action configuration
				var precedingAction = node.action;
				if (precedingAction) if (precedingAction.name === this.name) {
					//				if(node.parent.state.nextCheckpointId != pod.nextCheckpointId && this.thrust == 100) return true;
					if (precedingAction.thrust <= this.thrust) return true;else return false;
				}
				if (!node._stepsToCheckpoint1) node._stepsToCheckpoint1 = podStepsToPoint(pod, this.p1);
				(0, _log.traceJSON)("MoveToCheckpoint2 _stepsToCheckpoint1 = " + node._stepsToCheckpoint1, {});
				return node._stepsToCheckpoint1 <= this.actionSteps; // && (stepsToCheckpoint1 > 3);
			}
		}]);

		return MoveToCheckpoint2;
	}(_findsolution.SmartAction);

	// Accepts DecisionTreeNode structure and point to check direction


	function goesOffCheckpoint1(node) {
		if (!node || !node.parent) return true;
		if (node.hasOwnProperty('_goesOffCheckpoint1')) return node._goesOffCheckpoint1;

		node._goesOffCheckpoint1 = function () {
			var prevPod = node.parent.state;
			var pod = node.state;
			if (prevPod.nextCheckpointId != pod.nextCheckpointId) return false;
			if (Math.abs(prevPod.checkpoint1VelocityAngleRad) >= Math.PI / 2) return true;
			var checkpointIntersection = function checkpointIntersection(pod) {
				return pod.checkpoint1Distance * Math.abs(Math.tan(pod.checkpoint1VelocityAngleRad));
			};
			var podIntersection = checkpointIntersection(pod);
			(0, _log.traceJSON)("goesOffCheckpoint1 intersection " + podIntersection + " for pod ", pod.position);
			return podIntersection > 800 && checkpointIntersection(prevPod) < podIntersection;
		}();
		return node._goesOffCheckpoint1;
	}

	var podStepsToPoint = function podStepsToPoint(pod, point) {
		return stepsToPoint(pod.velocity.value(), pod.directionStats(point).angle, pod.position, point);
	};

	function stepsToPoint(initialVelocity, initialAngle, pos, point) {
		var steps = 0;
		var distanceIter = distance(pos.distance(point), velocity(initialVelocity * Math.cos(initialAngle), acceleration(angle(initialAngle))));
		while (distanceIter.next().value > 600 && steps < 50) {
			steps++;
		}return steps;
	}

	function angle(initialAngle) {
		var angle;
		return regeneratorRuntime.wrap(function angle$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						angle = Math.abs(initialAngle * Math.PI / 180);
						_context2.next = 3;
						return angle;

					case 3:
						if (!true) {
							_context2.next = 8;
							break;
						}

						_context2.next = 6;
						return angle > 0 ? angle -= Math.PI / 10 : 0;

					case 6:
						_context2.next = 3;
						break;

					case 8:
					case "end":
						return _context2.stop();
				}
			}
		}, _marked[0], this);
	}

	function acceleration(alpha) {
		return regeneratorRuntime.wrap(function acceleration$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						if (!true) {
							_context3.next = 5;
							break;
						}

						_context3.next = 3;
						return Math.max(Math.cos(alpha.next().value) * 200, 0);

					case 3:
						_context3.next = 0;
						break;

					case 5:
					case "end":
						return _context3.stop();
				}
			}
		}, _marked[1], this);
	}

	function velocity(initialVelocity, acceleration) {
		var velocity;
		return regeneratorRuntime.wrap(function velocity$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						velocity = initialVelocity;
						_context4.next = 3;
						return velocity;

					case 3:
						if (!true) {
							_context4.next = 8;
							break;
						}

						_context4.next = 6;
						return velocity = velocity * .85 + acceleration.next().value;

					case 6:
						_context4.next = 3;
						break;

					case 8:
					case "end":
						return _context4.stop();
				}
			}
		}, _marked[2], this);
	}

	function distance(start, velocity) {
		var distance;
		return regeneratorRuntime.wrap(function distance$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						distance = start;
						_context5.next = 3;
						return distance;

					case 3:
						if (!true) {
							_context5.next = 8;
							break;
						}

						_context5.next = 6;
						return distance -= velocity.next().value;

					case 6:
						_context5.next = 3;
						break;

					case 8:
					case "end":
						return _context5.stop();
				}
			}
		}, _marked[3], this);
	}

	exports.default = predictOptions;

	/***/
},
/* 7 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.traceJSON = exports._DEBUG = exports._TRACE = undefined;

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}

	var _TRACE = 1;
	var _DEBUG = 2;

	function traceJSON(desc, json) {
		var level = arguments.length <= 2 || arguments[2] === undefined ? _DEBUG : arguments[2];

		if (_config2.default.log_level >= level) {
			var str = desc + ": " + JSON.stringify(json, function (key, value) {
				if (key == 'parent' || key == 'children') {
					return "#REF";
				} else {
					return value;
				}
			});
			if (_config2.default.logger) _config2.default.logger(str);else console.log(str);
		}
	}

	exports._TRACE = _TRACE;
	exports._DEBUG = _DEBUG;
	exports.traceJSON = traceJSON;

	/***/
},
/* 8 */
/***/function (module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.BFS = exports.DFS = exports.ActionsTreeExpander = exports.SmartAction = exports.DecisionTreeNode = exports.Result = exports.findOptimalSolution = undefined;

	var _log = __webpack_require__(7);

	var SEARCH_CUTOFF = Symbol.for("findsolution.cutoff");

	// Performs tree search going through nodes in the order defined by queue.
	// Nodes in the tree expanded using TreeExpander class instance
	//   initialState - starting point for the search
	//   treeGen class instance of TreeExpander
	//	 checkTarget function accepts node.state, should return true if search target achieved
	//	 use queue DFS for Depth First Search, BFS is used by default
	function findOptimalSolution(_ref7) {
		var initialState = _ref7.initialState;
		var treeExpander = _ref7.treeExpander;
		var checkTarget = _ref7.checkTarget;
		var _ref7$depthLimit = _ref7.depthLimit;
		var depthLimit = _ref7$depthLimit === undefined ? 0 : _ref7$depthLimit;
		var _ref7$queue = _ref7.queue;
		var queue = _ref7$queue === undefined ? new BFS() : _ref7$queue;

		// Validate input params
		if (!(treeExpander instanceof TreeExpander)) throw new Error("treeGen parameter should be instanceof TreeExpander subclass");
		if (!queue.next || !queue.push) throw new Error("queue should have push and next functions defined");

		//Initialize either from the state or from queue
		var root;
		if (queue.length == 0) {
			root = new DecisionTreeNode({ state: initialState });
			queue.push(root);
		} else {
			// If queue is not empty we expectits initialized with root node
			root = queue[0];
		}

		// Go through all nodes in the order defined by queue.next,
		// expanding every node further to the queue using treeGen.expandNode
		while (queue.length > 0) {
			var node = queue.next();
			//		traceJSON("queue", queue);
			if (!(node instanceof DecisionTreeNode)) throw new Error("Incorrect node was generated by treeExpander: " + node);
			if (checkTarget(node.state)) return new SuccessResult({ node: node, root: root });
			if (depthLimit == 0 || node.depth < depthLimit) {
				(0, _log.traceJSON)("Expanding node ", node);
				var expander = treeExpander.expandNode(node);
				if (queue.length > 10) expander = expander.filter(function (node) {
					return !node.duplicate(queue);
				});
				queue.push.apply(queue, _toConsumableArray(expander));
				//			traceJSON("Expanded node with ", expander)
			}
		}
		return new FailureResult(SEARCH_CUTOFF, { root: root });
	}

	// Action interface, action applied to node generates successor node
	// Subclass must overload
	//   .isApplicable(DecisionTreeNode)
	//		returns true if action can be applied to the node.
	//		Please note, cutting off nodes from the search can decrease search complexity
	//		from O(b^d) to O(b*d) (e.g. increase performance), where b is average number
	// 		of branches from usual node and d is search depth
	//   .apply(DecisionTreeNode node)
	//		should return successor state of a node.state, which will be automatically
	//		wrapped into DecisionTreeNode
	//   .cost()
	//		cost of action later aggregated into path cost. By default cost of action is 1.
	// Please note, subclass constructor can call super(props) to initialize its
	// instance properties, in fact it just does following:
	//		Object.assign(this, params); 
	// Nevertheless action is a verb, its defined as class to let it contain its configuration

	var SmartAction = function () {
		function SmartAction(params) {
			_classCallCheck(this, SmartAction);

			Object.assign(this, params);
		}
		// apply action to decisionTreeNode.state, returns resulting state


		_createClass(SmartAction, [{
			key: "apply",
			value: function apply(decisionTreeNode) {
				throw new Error("SmartAction is abstract class, should not be instantiated");
			}
		}, {
			key: "isApplicable",
			value: function isApplicable(decisionTreeNode) {
				throw new Error("SmartAction is abstract class, should not be instantiated");
			}
		}, {
			key: "cost",
			value: function cost() {
				return 1;
			}
		}]);

		return SmartAction;
	}();

	// TreeExpander interface, action applied to node generates successor node
	// Subclass must overload expandNode method, accepting treeNode instance of DecisionTreeNode, 
	// returning array of expanded nodes instances of DecisionTreeNode


	var TreeExpander = function () {
		function TreeExpander() {
			_classCallCheck(this, TreeExpander);
		}

		_createClass(TreeExpander, [{
			key: "expandNode",

			// treeNode
			value: function expandNode(treeNode) {
				throw new Error("TreeExpander is abstract class, should not be instantiated");
			}
		}]);

		return TreeExpander;
	}();

	// Node leafs represent states, branch is action.
	// Action is transforming node into successor node.
	// New ActionsTreeExpander([new SmartAction1(), new SmartAction2()])


	var ActionsTreeExpander = function (_TreeExpander) {
		_inherits(ActionsTreeExpander, _TreeExpander);

		function ActionsTreeExpander(actions) {
			_classCallCheck(this, ActionsTreeExpander);

			var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(ActionsTreeExpander).call(this));

			_this7.actions = actions;
			return _this7;
		}

		_createClass(ActionsTreeExpander, [{
			key: "expandNode",
			value: function expandNode(node) {
				return this.actions.filter(function (action) {
					return action.isApplicable(node);
				}).map(function (action) {
					(0, _log.traceJSON)("exec action", action);
					return node.addChild(action);
				});
			}
		}]);

		return ActionsTreeExpander;
	}(TreeExpander);

	// DecisionTree is a resulting tree structure with state and action stored


	var DecisionTreeNode = function () {
		function DecisionTreeNode(_ref8) {
			var _ref8$action = _ref8.action;
			var action = _ref8$action === undefined ? null : _ref8$action;
			var _ref8$parent = _ref8.parent;
			var parent = _ref8$parent === undefined ? null : _ref8$parent;
			var _ref8$state = _ref8.state;
			var state = _ref8$state === undefined ? null : _ref8$state;

			_classCallCheck(this, DecisionTreeNode);

			this.parent = parent;
			this.state = parent && action ? action.apply(parent) : state;
			this.action = action;
			this.depth = parent ? parent.depth + 1 : 0;
			this.children = [];
		}

		_createClass(DecisionTreeNode, [{
			key: "addChild",
			value: function addChild(action) {
				var node = new DecisionTreeNode({ action: action, parent: this });
				this.children.push(node);
				return node;
			}
		}, {
			key: "path",
			value: function path() {
				if (this.depth == 0) return [this];
				var path = this.parent.path();
				path.push(this);
				return path;
			}
		}, {
			key: "duplicate",
			value: function duplicate(queue) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = queue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var node = _step.value;
						if (node.state.similar(this.state)) return true;
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				return false;
			}
		}]);

		return DecisionTreeNode;
	}();

	// Search result types


	var Result = function Result(_ref9) {
		var _ref9$success = _ref9.success;
		var success = _ref9$success === undefined ? true : _ref9$success;
		var result = _ref9.result;

		_classCallCheck(this, Result);

		this.success = success;
		this.result = result;
	};

	// success result 


	var SuccessResult = function (_Result) {
		_inherits(SuccessResult, _Result);

		function SuccessResult(_ref10) {
			var node = _ref10.node;
			var root = _ref10.root;

			_classCallCheck(this, SuccessResult);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(SuccessResult).call(this, { result: { node: node, root: root } }));
		}

		return SuccessResult;
	}(Result);

	var FailureResult = function (_Result2) {
		_inherits(FailureResult, _Result2);

		function FailureResult(failure, _ref11) {
			var root = _ref11.root;

			_classCallCheck(this, FailureResult);

			var _this9 = _possibleConstructorReturn(this, Object.getPrototypeOf(FailureResult).call(this, { success: false, result: { root: root } }));

			_this9.failure = failure;
			return _this9;
		}

		return FailureResult;
	}(Result);

	// QUEUES: use for DFS or BFS search order


	var DFS = function (_extendableBuiltin2) {
		_inherits(DFS, _extendableBuiltin2);

		function DFS() {
			_classCallCheck(this, DFS);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(DFS).apply(this, arguments));
		}

		_createClass(DFS, [{
			key: "next",
			value: function next() {
				return this.pop();
			}
		}]);

		return DFS;
	}(_extendableBuiltin(Array));

	var BFS = function (_extendableBuiltin4) {
		_inherits(BFS, _extendableBuiltin4);

		function BFS() {
			_classCallCheck(this, BFS);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(BFS).apply(this, arguments));
		}

		_createClass(BFS, [{
			key: "next",
			value: function next() {
				return this.shift();
			}
		}]);

		return BFS;
	}(_extendableBuiltin3(Array));

	exports.findOptimalSolution = findOptimalSolution;
	exports.Result = Result;
	exports.DecisionTreeNode = DecisionTreeNode;
	exports.SmartAction = SmartAction;
	exports.ActionsTreeExpander = ActionsTreeExpander;
	exports.DFS = DFS;
	exports.BFS = BFS;
	exports.default = findOptimalSolution;

	/***/
},
/* 9 */
/***/function (module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.ConfigurableFunction = exports.InformedActionsTreeExpander = exports.findOptimalSolutionIBFS = undefined;

	var _findsolution = __webpack_require__(8);

	var _log = __webpack_require__(7);

	// Performs tree search going through nodes in the order defined by queue.
	// Nodes in the tree expanded using TreeExpander class instance
	//   initialState - starting point for the search
	//   treeGen class instance of TreeExpander
	//	 checkTarget function accepts node.state, should return true if search target achieved
	//	 use queue DFS for Depth First Search, BFS is used by default
	// find solution via informed search
	function findOptimalSolutionIBFS(_ref12) {
		var initialState = _ref12.initialState;
		var treeExpander = _ref12.treeExpander;
		var checkTarget = _ref12.checkTarget;
		var depthLimit = _ref12.depthLimit;
		var heuristic = _ref12.heuristic;

		var root = new InformedDecisionTreeNode({ state: initialState, heuristic: heuristic });
		var queue = new HOBFS(InformedDecisionTreeNode.compareInformedDecisionTreeNodes);
		queue.push(root);
		return (0, _findsolution.findOptimalSolution)({ treeExpander: treeExpander, checkTarget: checkTarget, queue: queue, depthLimit: depthLimit });
	}

	var ConfigurableFunction = function () {
		function ConfigurableFunction() {
			_classCallCheck(this, ConfigurableFunction);
		}

		_createClass(ConfigurableFunction, [{
			key: "apply",
			value: function apply() {}
		}]);

		return ConfigurableFunction;
	}();

	// Node leafs represent states, branch is action.
	// Action is transforming node into successor node.
	// New ActionsTreeExpander([new SmartAction1(), new SmartAction2()])


	var InformedActionsTreeExpander = function (_findsolution$Actions2) {
		_inherits(InformedActionsTreeExpander, _findsolution$Actions2);

		function InformedActionsTreeExpander(actions) {
			_classCallCheck(this, InformedActionsTreeExpander);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(InformedActionsTreeExpander).call(this, actions));
		}

		_createClass(InformedActionsTreeExpander, [{
			key: "expandNode",
			value: function expandNode(node) {
				return this.actions
				//			.filter(action => action.isApplicable(node))
				.map(function (action) {
					(0, _log.traceJSON)("exec action", action);
					return node.addChild(action);
				});
			}
		}]);

		return InformedActionsTreeExpander;
	}(_findsolution.ActionsTreeExpander);

	// DecisionTree is a resulting tree structure with state and action stored
	// adds two parameters to DecisionTreeNode:
	//   	targetEstimate -- estimated cost to get to target state from the node (h(n) in CS)
	//	    pathCost -- cost of the path to the node (g(n) in CS)


	var InformedDecisionTreeNode = function (_findsolution$Decisio) {
		_inherits(InformedDecisionTreeNode, _findsolution$Decisio);

		function InformedDecisionTreeNode(_ref13) {
			var _ref13$action = _ref13.action;
			var action = _ref13$action === undefined ? null : _ref13$action;
			var _ref13$parent = _ref13.parent;
			var parent = _ref13$parent === undefined ? null : _ref13$parent;
			var _ref13$state = _ref13.state;
			var state = _ref13$state === undefined ? null : _ref13$state;
			var heuristic = _ref13.heuristic;

			_classCallCheck(this, InformedDecisionTreeNode);

			if (!(heuristic instanceof ConfigurableFunction)) throw new Error("heuristic is required parameter for InformedDecisionTreeNode constructor, must be instance of ConfigurableFunction class accepting state, returning optimistic cost to reach target");

			var _this13 = _possibleConstructorReturn(this, Object.getPrototypeOf(InformedDecisionTreeNode).call(this, { action: action, parent: parent, state: state }));

			_this13.heuristic = heuristic;
			_this13.pathCost = parent ? parent.pathCost + action.cost(parent) : 0;
			_this13.targetEstimate = heuristic.apply(_this13.state);
			_this13.totalCostEstimate = _this13.pathCost + _this13.targetEstimate;
			return _this13;
		}

		_createClass(InformedDecisionTreeNode, [{
			key: "addChild",
			value: function addChild(action) {
				var node = new InformedDecisionTreeNode({ action: action, parent: this, heuristic: this.heuristic });
				this.children.push(node);
				return node;
			}
		}, {
			key: "path",
			value: function path() {
				if (this.depth == 0) return [this];
				var path = this.parent.path();
				path.push(this);
				return path;
			}
		}], [{
			key: "compareInformedDecisionTreeNodes",
			value: function compareInformedDecisionTreeNodes(a, b) {
				if (a.totalCostEstimate > b.totalCostEstimate) return 1;else if (a.totalCostEstimate < b.totalCostEstimate) return -1;
				return 0;
			}
		}]);

		return InformedDecisionTreeNode;
	}(_findsolution.DecisionTreeNode);

	// Ordered BFS queue by compare function


	var HOBFS = function (_extendableBuiltin6) {
		_inherits(HOBFS, _extendableBuiltin6);

		function HOBFS(compareFn) {
			_classCallCheck(this, HOBFS);

			var _this14 = _possibleConstructorReturn(this, Object.getPrototypeOf(HOBFS).call(this));

			_this14.compare = compareFn;
			return _this14;
		}

		_createClass(HOBFS, [{
			key: "push",
			value: function push() {
				var _get2;

				for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
					nodes[_key] = arguments[_key];
				}

				(_get2 = _get(Object.getPrototypeOf(HOBFS.prototype), "push", this)).call.apply(_get2, [this].concat(nodes));
				this.sort(this.compare);
				(0, _log.traceJSON)("HOBFS push: ", this.map(function (i) {
					return i.totalCostEstimate;
				}));
			}
		}, {
			key: "next",
			value: function next() {
				return this.shift();
			}
		}]);

		return HOBFS;
	}(_extendableBuiltin5(Array));

	exports.findOptimalSolutionIBFS = findOptimalSolutionIBFS;
	exports.InformedActionsTreeExpander = InformedActionsTreeExpander;
	exports.ConfigurableFunction = ConfigurableFunction;
	exports.default = findOptimalSolutionIBFS;

	/***/
}
/******/]);