/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
		"numVehicles": 1,
		"totalLaps": 3,
		"limitTurns": 100,
		"log_level": 1
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _pod = __webpack_require__(3);

	var _pod2 = _interopRequireDefault(_pod);

	var _point = __webpack_require__(5);

	var _point2 = _interopRequireDefault(_point);

	var _vector = __webpack_require__(4);

	var _vector2 = _interopRequireDefault(_vector);

	var _log = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var config = __webpack_require__(1);

	var trackConfig = false;
	var boostUsed = false;

	var myPods, hisPods;

	var iface, readline, print, printErr;

	module.exports.interface = (readlineF, printF, printErrF) => {
	    iface = {
	        "readline": readlineF,
	        "print": printF,
	        "printErr": printErrF
	    };
	    ({ readline, print, printErr } = iface);
	};

	// EXPORT for external modules

	module.exports.init = GlobalInit;
	module.exports.initPods = readPods;

	function readPods() {
	    myPods.forEach(pod => pod.read());
	    hisPods.forEach(pod => pod.read());
	}

	// game loop
	module.exports.turn = () => {
	    if (!trackConfig) throw new Error("Track.turn: Track not initialized");
	    readPods();

	    var target = new Array();
	    target.push(myPods[0].optimalMoveAI(hisPods)); // {x:, y:, thrust:}

	    for (let i = 1; i < myPods.length; i++) target.push(myPods[i].pickOptimalTarget(hisPods).huntMove(myPods.slice(0, 1))); // {x:, y:, thrust:}


	    myPods.forEach((pod, i) => {
	        if (pod.collisionImpact(hisPods) > (i == 0 ? .25 : 0)) target[i].thrust = "SHIELD";
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
	    target.forEach(target => print(target.x + ' ' + target.y + ' ' + target.thrust));

	    //    print(target2.x + ' ' + target2.y + ' ' + target2.thrust);
	    //    printErr("target turns: " + JSON.stringify(target));

	    if (myPods[0].totalCheckpoints < trackConfig.totalCheckpointsLaps) return true;
	};

	module.exports.prev_turn = () => {
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

	module.exports.calculatePodMoveToTarget = (podId, nx, ny, thrust) => {
	    var pod = myPods[podId];
	    var intentVector = new _vector2.default(pod.position, new _point2.default(nx, ny));

	    var res = pod.calculateMove(intentVector, thrust);
	    var nextCheckpointId = pod.nextCheckpointId;
	    if (trackConfig.checkpoints[nextCheckpointId].distance(res.position) < 600) nextCheckpointId = (nextCheckpointId + 1) % trackConfig.numCheckpoints;

	    return Object.assign({ nextCheckpointId: nextCheckpointId }, res);
	};

	module.exports.shadowPodMoveToTarget = ({ pod, x, y, thrust }) => {
	    var intentVector = new _vector2.default(pod.position, new _point2.default(x, y));

	    var res = pod.calculateMove(intentVector, thrust);
	    res.target = { x, y, thrust };
	    let nextCheckpointId = pod.nextCheckpointId;
	    if (trackConfig.checkpoints[nextCheckpointId].distance(res.position) < 500) nextCheckpointId = (nextCheckpointId + 1) % trackConfig.numCheckpoints;
	    res.nextCheckpointId = nextCheckpointId;

	    return pod.duplicateAndInit(res).updateCheckpoint();
	};

	module.exports.getTrack = () => trackConfig;
	module.exports.getPods = () => myPods;

	//// BELOW is a copy form codinggame


	//// General initialization

	function GlobalInit(numMyPods = 1, numOpponentPods = 0) {
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

	    myPods = Array(numMyPods).fill(1).map((v, i) => {
	        return new _pod2.default(iface, trackConfig, -i);
	    });
	    hisPods = Array(numOpponentPods).fill(1).map((v, i) => {
	        return new _pod2.default(iface, trackConfig, i);
	    });
	    printErr("My pods: " + JSON.stringify(myPods));
	}

	function toInt(s) {
	    return parseInt(s);
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var readline, printErr, trackConfig;

	class Pod {
	    // Pod functions

	    constructor(iface, track, id) {
	        this.totalCheckpoints = 0;
	        this.id = id;
	        this.generation = 1;
	        this.collisions = [];
	        if (iface) ({ readline, printErr } = iface);
	        if (track) trackConfig = track;
	    }

	    read() {
	        var input = readline();
	        var [x, y, vx, vy, a, cid] = input.split(' ').map(toInt);
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

	    updateCheckpoint() {
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

	    duplicateAndInit({ position, vx, vy, angle, nextCheckpointId, target }) {
	        let velocity = new _vector2.default(new _point2.default(vx, vy));
	        var pod = Object.assign(new Pod(false, false, this.id), {
	            position,
	            velocity,
	            velocityValue: velocity.value(),
	            angleX: angle,
	            orientation: _vector2.default._horizonVector.rotate(angle),
	            nextCheckpointId,
	            nextCheckpointUpdated: nextCheckpointId != this.nextCheckpointId,
	            target,
	            totalCheckpoints: this.totalCheckpoints,
	            id: this.id,
	            generation: this.generation + 1,
	            checkpoint1: this.checkpoint1,
	            checkpoint2: this.checkpoint2
	        });
	        return pod;
	    }

	    // return relative stats from pod to point {distance, angle, velocityAngle}
	    relativeStats(p) {
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
	    directionStats(p) {
	        var res = {};
	        res.vector = new _vector2.default(this.position, p);
	        res.angle = res.vector.angleToRad(this.orientation); //angleX is relative angle

	        return res;
	    }

	    // return relative stats from pod to point {distance, angle, velocityAngle}
	    velocityStats(p) {
	        var res = {};
	        res.vector = new _vector2.default(this.position, p);
	        res.angle = res.vector.angleToRad(this.velocity); //angleX is relative angle
	        res.velocityInDirection = this.velocityValue * Math.cos(res.angle);

	        return res;
	    }

	    // calculated optimal direction and thrust of pod to move to the target Point
	    // returns {x, y, thrust}
	    aimToTarget(target, recommendedThrust = 100) {
	        let targStat = this.directionStats(target);
	        let thrust = Math.abs(targStat.angle) > Math.PI / 2 ? 0 : recommendedThrust; // Math.round(100*Math.cos(cpAngleRad/6));

	        //        if (!boostUsed && p1Stat.angleAbs < 10 && p1Stat.distance > 5000) {
	        //            thrust = "BOOST";
	        //            boostUsed = true;
	        //        }

	        return Object.assign({ thrust: thrust }, target);
	    }

	    aimToCheckpoint1(recommendedThrust = 100) {
	        let thrust = Math.abs(this.checkpoint1Angle) > 90 ? 0 : recommendedThrust; // Math.round(100*Math.cos(cpAngleRad/6));
	        let target = this.checkpoint1;

	        let angleVelocity = this.checkpoint1VelocityAngleRad * 180 / Math.PI;
	        if (Math.abs(angleVelocity) < 90 && Math.abs(this.checkpoint1Angle) < 90) target = target.rotate(this.position, angleVelocity);

	        return Object.assign({ thrust: thrust }, target);
	    }

	    distance(poi) {
	        if (poi instanceof _point2.default) return this.position.distance(poi);else if (poi instanceof Pod) return this.position.distance(poi.position);else if (poi.x && poi.y) return this.position.distance(poi);
	    }

	    // calculated optimal direction and thrust of pod to move to the Point p1 
	    // considering that after reaching p1 it has to move towards p2
	    // returns {x: x, y: y, thrust: thrust}
	    optimalMoveAI(hisPods = []) {
	        if (this.enemy && this.runAwayFromEnemy()) return this.target;
	        if (this.velocityValue > 400 & this.avoidCollision(hisPods, 5, false, this.checkpoint1Vector)) return this.target;
	        if (this.velocityValue < 1000 && this.totalCheckpoints < trackConfig.totalCheckpointsLaps) {
	            let options = { pod: this, depth: 50 };
	            if (this.enemy && this.enemy.distance(this) < 3000) options.behaviour = 'fastspeed';
	            let res = (0, _predictor2.default)(options);
	            let node = res.result.node;
	            if (node && node.parent) {
	                this.target = node.path()[1].state.target;
	                (0, _log.traceJSON)(`optimalMoveAI (depth = ${ node.depth }): `, node.path()[1], _log._TRACE);
	                return this.target;
	            }
	        }
	        this.target = this.optimalMove();
	        return this.target;
	    }

	    runAwayFromEnemy() {
	        if (!this.enemy) return false;
	        let enemyVector = new _vector2.default(this.position, this.enemy.position);
	        let angleEnemyToCheckpoint = this.checkpoint1Vector.angleTo(enemyVector);
	        (0, _log.traceJSON)(`runAwayFromEnemy angle ${ angleEnemyToCheckpoint }`, this.relativeStats(this.enemy.position), _log._TRACE);
	        if (this.enemy.distance(this) > 2000 || this.enemy.distance(this) > this.checkpoint1Distance || this.enemy.distance(this.checkpoint1) > this.checkpoint1Distance || Math.abs(angleEnemyToCheckpoint) > 60) return false;
	        this.target = this.position.add(enemyVector.rotate(Math.sign(angleEnemyToCheckpoint) * 90));
	        this.target.thrust = 200;
	        (0, _log.traceJSON)(`runAwayFromEnemy target `, this.target, _log._TRACE);
	        return true;
	    }

	    // calculated optimal direction and thrust of pod to move to the Point p1 
	    // considering that after reaching p1 it has to move towards p2
	    // returns {x: x, y: y, thrust: thrust}
	    optimalMove() {
	        let p1 = this.checkpoint1;
	        let p2 = this.checkpoint2;
	        (0, _log.traceJSON)("podOptimalMove: ", this, _log._TRACE);
	        let p1Stat = this.relativeStats(p1);

	        let thrust = 0;
	        if (Math.abs(this.checkpoint1Angle) < 90 && this.velocityValue < 400 || Math.abs(this.checkpoint1Angle) < 45) thrust = 100;
	        if (Math.abs(this.checkpoint1Angle) < 15 || Math.abs(this.checkpoint1Angle) < 60 && Math.abs(this.checkpoint1Angle) > 15 && Math.sign(this.checkpoint1Angle) != Math.sign(-this.checkpoint1VelocityAngleRad)) thrust = 200;

	        let target = p1;

	        let targStat = this.relativeStats(target);

	        // patch target when far and moving in wrong direction
	        if (targStat.angleVelocityAbs < 90 && targStat.angleAbs < 90) target = target.rotate(this.position, targStat.angleVelocity);

	        //        if (!boostUsed && p1Stat.angleAbs < 10 && p1Stat.distance > 5000) {
	        //            thrust = "BOOST";
	        //            boostUsed = true;
	        //        }

	        this.target = Object.assign({ thrust: thrust }, target);

	        return this.target;
	    }

	    avoidCollision(hisPods = [], steps = 3, allCollisions = false, intentVec) {
	        if (!hisPods.length) return false;
	        if (!intentVec) intentVec = this.velocity;
	        let pods = hisPods.map(pod => ({ pod, angle: pod.velocity.angleTo(intentVec) }));
	        if (!allCollisions) pods = pods.filter(i => Math.abs(i.angle) > 60);
	        let positions = [];
	        let myPos = [...this.extrapolatePositions(steps)];
	        pods.map(podR => [...podR.pod.extrapolatePositions(steps)].map((position, i) => ({ i, position, pod: podR.pod, angle: podR.angle,
	            distance: position.distance(myPos[i]) }))).forEach(podsR => positions.push(...podsR));
	        let collisions = positions.filter(i => i.distance < 800).filter(i => i.position.distance(this.position) < this.checkpoint1Distance - 200);
	        (0, _log.traceJSON)(`avoidCollision positions distances [${ steps }]`, positions.map(i => i.distance));
	        if (collisions.length) {
	            let intersectAngle = collisions[0].angle;
	            let angle = Math.sign(intersectAngle) * 90;
	            (0, _log.traceJSON)(`avoidCollision velocitiesAngle ${ intersectAngle } rotate by `, angle, _log._TRACE);
	            let thrust = 200;
	            if (this.checkpoint1Distance < 1500) thrust = 50;
	            this.target = this.position.add(this.orientation.scale(100).rotate(angle));
	            this.target.thrust = thrust;
	            return true;
	        }
	        return false;
	    }

	    huntMove(friendlyPods = []) {
	        if (this.superAim) return Object.assign({ thrust: 200 }, this.huntCalcTarget(this.superAim));
	        if (!this.aim) return Object.assign({ thrust: 200 }, this.checkpoint2);
	        var target = { thrust: 200 };
	        var targetPod = this.aim;
	        (0, _log.traceJSON)("hunting target ", targetPod);
	        var targetDistance = this.position.distance(targetPod.position);
	        //TODO: avoid hitting own pod
	        if (friendlyPods.length) {
	            if (this.avoidCollision(friendlyPods, 7, true)) return Object.assign(this.target, { thrust: 50 });else if (this.position.distance(friendlyPods[0].position) < 1000) target.thrust = 50;
	        }

	        /*        if(targetDistance<1400) // attack!!!
	                    Object.assign(target, targetPod.position);
	                else */if (this.isMovingTowardsMe(targetPod) || targetDistance < 2000 && this.velocityValue > targetPod.velocityValue) Object.assign(target, this.huntCalcTarget(targetPod));else {
	            Object.assign(target, targetPod.checkpoint2.add(new _vector2.default(targetPod.checkpoint1, targetPod.checkpoint2).scale(.2)));
	            if (this.distance(target) < 5000) {
	                target = Object.assign({}, targetPod.checkpoint1);
	                if (Math.abs(this.orientation.angleTo(target)) > 90) target.thrust = 0;else target.thrust = 100;
	            }
	            (0, _log.traceJSON)(`huntMove to checkpoint2 distance ${ this.distance(target) } `, target, _log._TRACE);
	        }
	        //    printErr("turns to target: " + Math.ceil(targetDistance/(targetPod.velocity.value+1)) + " velocity " + targetPod.velocity.value);
	        return target;
	    }

	    huntCalcTarget(targetPod) {
	        let tStat = this.relativeStats(targetPod.position);
	        let target = targetPod.position;
	        //        if(tStat.distance>1400) {
	        target = targetPod.extrapolatePosition(Math.round(tStat.distance / 2 / (targetPod.velocityValue + 1)));
	        if (Math.abs(targetPod.velocity.angleTo(targetPod.orientation)) < 20) {
	            if (tStat.distance > 3000 && tStat.angleVelocityAbs < 90) target = target.rotate(this.position, tStat.angleVelocity);else if (tStat.distance > 3000 && tStat.angleVelocityAbs < 120) target = target.rotate(this.position, tStat.angleVelocity / 2);
	        }
	        if (tStat.angleAbs > 90) target.thrust = 0;else if (tStat.angleAbs > 45) target.thrust = 50;
	        //        }
	        return target;
	    }

	    extrapolatePosition(turns) {
	        var intentVector = new _vector2.default(this.position, this.checkpoint1);

	        //        var accelerationImpact = (1 + turns) * turns / 2 * Math.pow(.85, turns-1);

	        return this.position.add(this.velocity.scale(turns)).add(intentVector.scale(50 / intentVector.value() * turns)) //add thrust approximation
	        .add(this.orientation.scale(turns)); //add orientation approximation
	    }

	    *extrapolatePositions(turns) {
	        var position = this.position;
	        var velocity = this.velocity;
	        var thrust = this.orientation.scale(2); // consider thrust 100
	        let i = turns;
	        while (i--) {
	            velocity = velocity.add(thrust);
	            yield position = position.add(velocity);
	            velocity = velocity.scale(0.85);
	        }
	    }

	    isMovingTowardsMe(pod) {
	        var intentVector = new _vector2.default(pod.position, pod.checkpoint1);
	        var podToThisVector = new _vector2.default(pod.position, this.position);
	        return Math.abs(intentVector.angleTo(podToThisVector)) < 60 || Math.abs(pod.orientation.angleTo(podToThisVector)) < 60;
	    }

	    // returns collision impact 0-1, 0 for no collision, 1 for strongest
	    collisionImpact(pods) {
	        for (var i in pods) {
	            var pod = pods[i];
	            var collisionDistance = this.position.add(this.velocity).add(this.orientation).distance(pod.position.add(pod.velocity).add(pod.orientation));
	            if (collisionDistance < 800) {
	                var impact = (this.velocityValue + pod.velocityValue) / 1000 * Math.abs(this.velocity.angleTo(pod.velocity)) / 45;
	                (0, _log.traceJSON)(`Collision distance: ${ collisionDistance } impact ${ impact }`, pod, _log._TRACE);
	                this.collisions[pod.id] = this.collisions[pod.id] ? this.collisions[pod.id] + 1 : 1;
	                if (this.collisions[pod.id] > 2) {
	                    (0, _log.traceJSON)("RED ALERT!!! Avoid ", pod, _log._TRACE);
	                    this.avoidEnemy(pod);
	                }
	                return impact;
	            }
	        }
	        return 0;
	    }

	    avoidEnemy(pod) {
	        this.enemy = pod;
	    }

	    //pick the leader for chasing
	    pickOptimalTarget(pods) {
	        if (this.superAim) {
	            this.aim = this.superAim;return this;
	        }
	        let aim = this.aim;
	        if (!aim) aim = pods[0];
	        for (var i in pods) if (pods[i].totalCheckpoints > aim.totalCheckpoints) aim = pods[i];

	        if (this.aim && this.distance(this.aim) < 2000 && this.aim.totalCheckpoints > aim.totalCheckpoints - 1) return this;

	        this.aim = aim;
	        printErr(`Pick target: ${ JSON.stringify(this.aim) }`);
	        return this;
	    }

	    attack(enemyPod) {
	        if (!this.superAim) this.superAim = enemyPod;
	    }

	    calculateMove(intentVector, thrust) {
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

	    similar(pod) {
	        return pod.position.distance(this.position) < 100 && pod.velocity.angleTo(this.velocity) < 1;
	    }

	}

	function toInt(s) {
	    return parseInt(s);
	}

	exports.default = Pod;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _point = __webpack_require__(5);

	var _point2 = _interopRequireDefault(_point);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _degreeToRadians = 180 / Math.PI;

	class Vector {
	    // Note: vector might have float coordinates
	    constructor(p1, p2) {
	        if (!p2) {
	            this.x = p1.x;
	            this.y = p1.y;
	        } else {
	            this.x = p2.x - p1.x;
	            this.y = p2.y - p1.y;
	        }
	    }

	    add(v) {
	        return new Vector(new _point2.default(this.x + v.x, this.y + v.y));
	    }

	    scale(s) {
	        return new Vector(new _point2.default(this.x * s, this.y * s));
	    }

	    rotate(angle) {
	        var angleRad = angle / _degreeToRadians;
	        var rotatedX = this.x * Math.cos(angleRad) - this.y * Math.sin(angleRad);
	        var rotatedY = this.x * Math.sin(angleRad) + this.y * Math.cos(angleRad);
	        return new Vector(new _point2.default(rotatedX, rotatedY));
	    }

	    angleTo(v2) {
	        var angleV1 = Math.atan2(-this.y, this.x);
	        var angleV2 = Math.atan2(-v2.y, v2.x);

	        var delta = angleV2 - angleV1;
	        if (delta > Math.PI) delta -= Math.PI * 2;else if (delta < -Math.PI) delta += Math.PI * 2;

	        return delta * _degreeToRadians;
	    }

	    angleToRad(v2) {
	        var angleV1 = Math.atan2(-this.y, this.x);
	        var angleV2 = Math.atan2(-v2.y, v2.x);

	        var delta = angleV2 - angleV1;
	        if (delta > Math.PI) delta -= Math.PI * 2;else if (delta < -Math.PI) delta += Math.PI * 2;

	        return delta;
	    }

	    angle() {
	        var angle = Math.atan2(-this.y, this.x);
	        if (angle > 0) angle = 2 * Math.PI - angle;else if (angle < 0) angle *= -1;

	        return angle * _degreeToRadians;
	    }

	    value() {
	        return Math.hypot(this.x, this.y);
	    }
	}

	// Unfortunately ES6 does not support static members of the class, workaround:
	Vector._horizonVector = new Vector(new _point2.default(100, 0));

	exports.default = Vector;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var _degreeToRadians = 180 / Math.PI;

	class Point {

		// Point always has integer coordinates
		constructor(x, y) {
			this.x = x;
			this.y = y;
		}

		add(v) {
			return new Point(this.x + Math.round(v.x), this.y + Math.round(v.y));
		}

		rotate(around, angle) {
			var normalizedX = this.x - around.x;
			var normalizedY = this.y - around.y;
			var angleRad = angle / _degreeToRadians;
			var rotatedX = normalizedX * Math.cos(angleRad) - normalizedY * Math.sin(angleRad) + around.x;
			var rotatedY = normalizedX * Math.sin(angleRad) + normalizedY * Math.cos(angleRad) + around.y;

			return new Point(Math.round(rotatedX), Math.round(rotatedY));
		}

		distance(p2) {
			return Math.hypot(this.x - p2.x, this.y - p2.y);
		}

		angle() {
			var angle = Math.atan2(-this.y, this.x);
			if (angle > 0) angle = 2 * Math.PI - angle;else if (angle < 0) angle *= -1;

			return angle * _degreeToRadians;
		}
	}

	// Unfortunately ES6 does not support static members of the class, workaround:
	Point._zeroPoint = new Point(0, 0);

	exports.default = Point;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var loop = __webpack_require__(2);

	module.exports.predictOptions = predictOptions;

	function predictOptions({ pod, depth = 50, behaviour = 'optimal' }) {
		(0, _log.traceJSON)("predictOptions ", arguments);
		let treeExpander;
		//	if(behaviour === 'fastspeed')
		//		treeExpander = new PodActionsFastSpeed(pod.checkpoint1, pod.checkpoint2);
		//	else
		treeExpander = new PodActions(pod.checkpoint1, pod.checkpoint2);
		let res = (0, _informedsearch.findOptimalSolutionIBFS)({
			initialState: pod,
			treeExpander,
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
	class PodEstimateTarget extends _informedsearch.ConfigurableFunction {
		constructor(pos, p1, p2) {
			super();
			this.p1 = p1;
			this.p2 = p2;
			let angleCP2 = new _vector2.default(p1, p2).angleToRad(new _vector2.default(pos, p1));
			this.stepsToP2 = stepsToPoint(200 / .15, angleCP2, p1, p2);
		}
		apply(pod) {
			let passedCheckpoint1 = pod.nextCheckpointId != this.p1.id;
			//		const podToPoint = (p1, p2) => Math.max((p1.distance(p2) - 600) / 1300, 0)
			if (!passedCheckpoint1) {
				return podStepsToPoint(pod, this.p1) - 4 + this.stepsToP2; //podToPoint(pod.position, this.p1); 
			} else {
				return podStepsToPoint(pod, this.p2); // podToPoint(pod.position, this.p2);
			}
		}
	}

	// On every state (pod position) search will try following actions, 
	// branching search until it reaches target
	class PodActionsFastSpeed extends _findsolution.ActionsTreeExpander {
		constructor(p1, p2) {
			super([new MoveToCheckpoint1({ p1, p2, thrust: 100 }), new MoveToCheckpoint1({ p1, p2, thrust: 200 }),
			//				new MoveToCheckpoint1Compensate({p1, p2, thrust: 200}),
			//				new MoveViaCheckpoint1({p1, p2, distance: 400, thrust: 100}),
			//				new MoveViaCheckpoint1({p1, p2, distance: 400, thrust: 200}),
			//				new MoveToCheckpoint2({p1, p2, thrust: 0}),
			//				new MoveToCheckpoint2({p1, p2, thrust: 50}),
			new MoveToCheckpoint2({ p1, p2, thrust: 200 }), new MoveToCheckpoint2({ p1, p2, thrust: 100 })]);
		}
	}

	// On every state (pod position) search will try following actions, 
	// branching search until it reaches target
	class PodActions extends _findsolution.ActionsTreeExpander {
		constructor(p1, p2) {
			super([new MoveToCheckpoint1({ p1, p2, thrust: 100 }), new MoveToCheckpoint1({ p1, p2, thrust: 200 }),
			//				new MoveToCheckpoint1Compensate({p1, p2, thrust: 200}),
			//				new MoveViaCheckpoint1({p1, p2, distance: 400, thrust: 100}),
			//				new MoveViaCheckpoint1({p1, p2, distance: 400, thrust: 200}),
			new MoveToCheckpoint2({ p1, p2, thrust: 0 }),
			//				new MoveToCheckpoint2({p1, p2, thrust: 50}),
			new MoveToCheckpoint2({ p1, p2, thrust: 200 }), new MoveToCheckpoint2({ p1, p2, thrust: 100 })]);
		}
	}

	// Targetting pod directly to checkpoint1, until turned to checkpoint2
	class MoveToCheckpoint1 extends _findsolution.SmartAction {
		constructor({ p1, p2, thrust = 100 }) {
			super({ p1, p2, thrust });
			this.name = "MoveToCheckpoint1";
		}
		apply(node) {
			let pod = node.state;
			var aim;

			/*        let angleVelocity = -pod.checkpoint1VelocityAngleRad * 180 / Math.PI;
	          if(Math.abs(angleVelocity) > 45 && pod.checkpoint1Distance > 2000
	          	&& pod.velocityValue > 400 ) 
	          	aim = pod.aimToCheckpoint1(this.thrust);
	          else*/
			aim = pod.aimToTarget(this.p1, this.thrust);

			return loop.shadowPodMoveToTarget(Object.assign({ pod }, aim));
		}
		isApplicable(node) {
			if (!node.action) return true;
			if (!this.isCompatible(node.action)) return false;
			if (this.thrust < node.action.thrust) return false;
			let pod = node.state;
			if (pod.nextCheckpointId != this.p1.id) return false;
			if (this.thrust == 200 && Math.abs(pod.checkpoint1Angle) > 30) return false;
			return goesOffCheckpoint1(node.parent) ? true : !goesOffCheckpoint1(node);
		}
		isCompatible(action) {
			return action.name == this.name;
		}
	}

	// Targetting pod near checkpoint1, to optimize turn to checkpoint2
	class MoveViaCheckpoint1 extends MoveToCheckpoint1 {
		constructor({ p1, p2, distance = 600, thrust = 100 }) {
			super({ p1, p2, thrust });
			this.distance = distance;
			this.name = "MoveViaCheckpoint1";
			this.P1P2 = new _vector2.default(this.p1, this.p2);
		}
		apply(node) {
			let pod = node.state;
			let podTarget = new _vector2.default(pod.position, this.p1);
			let angle = podTarget.angleTo(this.P1P2);
			let shiftVector = podTarget.rotate(90 * Math.sign(angle)).scale(this.distance / podTarget.value());
			//		console.log(`MoveViaCheckpoint1 angle ${angle} shift ${JSON.stringify(shiftVector)}`);
			let aim = pod.aimToTarget(this.p1.add(shiftVector), this.thrust);

			return loop.shadowPodMoveToTarget(Object.assign({ pod }, aim));
		}
	}

	class MoveToCheckpoint2 extends _findsolution.SmartAction {
		constructor({ p1, p2, thrust = 100 }) {
			super({ p1, p2, thrust });
			this.actionSteps = 3 + (200 - this.thrust) / 50;
			this.name = "MoveToCheckpoint2";
		}
		apply(node) {
			let pod = node.state;
			//let aim = pod.aimToTarget(this.p2, this.thrust);
			//		return loop.shadowPodMoveToTarget(Object.assign({pod}, aim));
			let passedCheckpoint1 = pod.nextCheckpointId != this.p1.id;
			let target = Object.assign({}, this.p2, { thrust: this.thrust });
			if (passedCheckpoint1) {
				target = pod.aimToCheckpoint1(this.thrust);
				// pod.checkpoint1 is this.p2 -- target checkpoint of this action
				/*	        let angleToVelocity = pod.checkpoint1VelocityAngleRad * 180 / Math.PI;
	   	        // patch target when far and moving in wrong direction
	   	        if(Math.abs(angleToVelocity) < 90 && Math.abs(pod.checkpoint1Angle) < 90 && pod.checkpoint1Distance > 2000) 
	   	            target = target.rotate(pod.position, angleToVelocity);*/
			}
			return loop.shadowPodMoveToTarget(Object.assign({ pod }, target));
		}
		isApplicable(node) {
			let pod = node.state;
			if (pod.velocityValue < 100 && this.thrust == 0) return false;
			//		if (passedCheckpoint1) 
			//			return this.thrust == 200; // After checkpoint1 allow only full thrust
			if (pod.nextCheckpointId == this.p1.id && node.parent && goesOffCheckpoint1(node)) return false;
			// Further it can continue only with the same action configuration
			let precedingAction = node.action;
			if (precedingAction) if (precedingAction.name === this.name) {
				//				if(node.parent.state.nextCheckpointId != pod.nextCheckpointId && this.thrust == 100) return true;
				if (precedingAction.thrust <= this.thrust) return true;else return false;
			}
			if (!node._stepsToCheckpoint1) node._stepsToCheckpoint1 = podStepsToPoint(pod, this.p1);
			(0, _log.traceJSON)(`MoveToCheckpoint2 _stepsToCheckpoint1 = ${ node._stepsToCheckpoint1 }`, {});
			return node._stepsToCheckpoint1 <= this.actionSteps; // && (stepsToCheckpoint1 > 3);
		}
	}

	// Accepts DecisionTreeNode structure and point to check direction
	function goesOffCheckpoint1(node) {
		if (!node || !node.parent) return true;
		if (node.hasOwnProperty('_goesOffCheckpoint1')) return node._goesOffCheckpoint1;

		node._goesOffCheckpoint1 = function () {
			let prevPod = node.parent.state;
			let pod = node.state;
			if (prevPod.nextCheckpointId != pod.nextCheckpointId) return false;
			if (Math.abs(prevPod.checkpoint1VelocityAngleRad) >= Math.PI / 2) return true;
			const checkpointIntersection = pod => pod.checkpoint1Distance * Math.abs(Math.tan(pod.checkpoint1VelocityAngleRad));
			let podIntersection = checkpointIntersection(pod);
			(0, _log.traceJSON)(`goesOffCheckpoint1 intersection ${ podIntersection } for pod `, pod.position);
			return podIntersection > 800 && checkpointIntersection(prevPod) < podIntersection;
		}();
		return node._goesOffCheckpoint1;
	}

	const podStepsToPoint = (pod, point) => stepsToPoint(pod.velocityValue, pod.directionStats(point).angle, pod.position, point);

	function stepsToPoint(initialVelocity, initialAngle, pos, point) {
		let steps = 0;
		let distanceIter = distance(pos.distance(point), velocity(initialVelocity * Math.cos(initialAngle), acceleration(angle(initialAngle))));
		while (distanceIter.next().value > 600 && steps < 50) steps++;
		return steps;
	}

	function* angle(initialAngle) {
		let angle = Math.abs(initialAngle * Math.PI / 180);
		yield angle;
		while (true) yield angle > 0 ? angle -= Math.PI / 10 : 0;
	}

	function* acceleration(alpha) {
		while (true) yield Math.max(Math.cos(alpha.next().value) * 200, 0);
	}

	function* velocity(initialVelocity, acceleration) {
		let velocity = initialVelocity;
		yield velocity;
		while (true) yield velocity = velocity * .85 + acceleration.next().value;
	}

	function* distance(start, velocity) {
		let distance = start;
		yield distance;
		while (true) yield distance -= velocity.next().value;
	}

	exports.default = predictOptions;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.traceJSON = exports._DEBUG = exports._TRACE = undefined;

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	const _TRACE = 1;
	const _DEBUG = 2;

	function traceJSON(desc, json, level = _DEBUG) {
		if (_config2.default.log_level >= level) {
			let str = desc + ": " + JSON.stringify(json, function (key, value) {
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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.BFS = exports.DFS = exports.ActionsTreeExpander = exports.SmartAction = exports.DecisionTreeNode = exports.Result = exports.findOptimalSolution = undefined;

	var _log = __webpack_require__(7);

	const SEARCH_CUTOFF = Symbol.for("findsolution.cutoff");

	// Performs tree search going through nodes in the order defined by queue.
	// Nodes in the tree expanded using TreeExpander class instance
	//   initialState - starting point for the search
	//   treeGen class instance of TreeExpander
	//	 checkTarget function accepts node.state, should return true if search target achieved
	//	 use queue DFS for Depth First Search, BFS is used by default
	function findOptimalSolution({ initialState, treeExpander, checkTarget, depthLimit = 0, queue = new BFS() }) {
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
			let node = queue.next();
			//		traceJSON("queue", queue);
			if (!(node instanceof DecisionTreeNode)) throw new Error(`Incorrect node was generated by treeExpander: ${ node }`);
			if (checkTarget(node.state)) return new SuccessResult({ node: node, root });
			if (depthLimit == 0 || node.depth < depthLimit) {
				(0, _log.traceJSON)("Expanding node ", node);
				let expander = treeExpander.expandNode(node);
				if (queue.length > 10) expander = expander.filter(node => !node.duplicate(queue));
				queue.push(...expander);
				//			traceJSON("Expanded node with ", expander)
			}
		}
		return new FailureResult(SEARCH_CUTOFF, { root });
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
	class SmartAction {
		constructor(params) {
			Object.assign(this, params);
		}
		// apply action to decisionTreeNode.state, returns resulting state
		apply(decisionTreeNode) {
			throw new Error("SmartAction is abstract class, should not be instantiated");
		}
		isApplicable(decisionTreeNode) {
			throw new Error("SmartAction is abstract class, should not be instantiated");
		}
		cost() {
			return 1;
		}
	}

	// TreeExpander interface, action applied to node generates successor node
	// Subclass must overload expandNode method, accepting treeNode instance of DecisionTreeNode, 
	// returning array of expanded nodes instances of DecisionTreeNode
	class TreeExpander {
		// treeNode
		expandNode(treeNode) {
			throw new Error("TreeExpander is abstract class, should not be instantiated");
		}
	}

	// Node leafs represent states, branch is action.
	// Action is transforming node into successor node.
	// New ActionsTreeExpander([new SmartAction1(), new SmartAction2()])
	class ActionsTreeExpander extends TreeExpander {
		constructor(actions) {
			super();
			this.actions = actions;
		}
		expandNode(node) {
			return this.actions.filter(action => action.isApplicable(node)).map(action => {
				(0, _log.traceJSON)("exec action", action);
				return node.addChild(action);
			});
		}
	}

	// DecisionTree is a resulting tree structure with state and action stored
	class DecisionTreeNode {
		constructor({ action = null, parent = null, state = null }) {
			this.parent = parent;
			this.state = parent && action ? action.apply(parent) : state;
			this.action = action;
			this.depth = parent ? parent.depth + 1 : 0;
			this.children = [];
		}
		addChild(action) {
			var node = new DecisionTreeNode({ action, parent: this });
			this.children.push(node);
			return node;
		}
		path() {
			if (this.depth == 0) return [this];
			let path = this.parent.path();
			path.push(this);
			return path;
		}
		duplicate(queue) {
			for (let node of queue) if (node.state.similar(this.state)) return true;
			return false;
		}
	}

	// Search result types
	class Result {
		constructor({ success = true, result }) {
			this.success = success;
			this.result = result;
		}
	}

	// success result 
	class SuccessResult extends Result {
		constructor({ node, root }) {
			super({ result: { node, root } });
		}
	}

	class FailureResult extends Result {
		constructor(failure, { root }) {
			super({ success: false, result: { root } });
			this.failure = failure;
		}
	}

	// QUEUES: use for DFS or BFS search order
	class DFS extends Array {
		next() {
			return this.pop();
		}
	}

	class BFS extends Array {
		next() {
			return this.shift();
		}
	}

	exports.findOptimalSolution = findOptimalSolution;
	exports.Result = Result;
	exports.DecisionTreeNode = DecisionTreeNode;
	exports.SmartAction = SmartAction;
	exports.ActionsTreeExpander = ActionsTreeExpander;
	exports.DFS = DFS;
	exports.BFS = BFS;
	exports.default = findOptimalSolution;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

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
	function findOptimalSolutionIBFS({ initialState, treeExpander, checkTarget, depthLimit, heuristic }) {
		var root = new InformedDecisionTreeNode({ state: initialState, heuristic });
		var queue = new HOBFS(InformedDecisionTreeNode.compareInformedDecisionTreeNodes);
		queue.push(root);
		return (0, _findsolution.findOptimalSolution)({ treeExpander, checkTarget, queue, depthLimit });
	}

	class ConfigurableFunction {
		apply() {}
	}

	// Node leafs represent states, branch is action.
	// Action is transforming node into successor node.
	// New ActionsTreeExpander([new SmartAction1(), new SmartAction2()])
	class InformedActionsTreeExpander extends _findsolution.ActionsTreeExpander {
		constructor(actions) {
			super(actions);
		}
		expandNode(node) {
			return this.actions
			//			.filter(action => action.isApplicable(node))
			.map(action => {
				(0, _log.traceJSON)("exec action", action);
				return node.addChild(action);
			});
		}
	}

	// DecisionTree is a resulting tree structure with state and action stored
	// adds two parameters to DecisionTreeNode:
	//   	targetEstimate -- estimated cost to get to target state from the node (h(n) in CS)
	//	    pathCost -- cost of the path to the node (g(n) in CS)
	class InformedDecisionTreeNode extends _findsolution.DecisionTreeNode {
		constructor({ action = null, parent = null, state = null, heuristic }) {
			if (!(heuristic instanceof ConfigurableFunction)) throw new Error("heuristic is required parameter for InformedDecisionTreeNode constructor, must be instance of ConfigurableFunction class accepting state, returning optimistic cost to reach target");
			super({ action, parent, state });
			this.heuristic = heuristic;
			this.pathCost = parent ? parent.pathCost + action.cost(parent) : 0;
			this.targetEstimate = heuristic.apply(this.state);
			this.totalCostEstimate = this.pathCost + this.targetEstimate;
		}
		addChild(action) {
			var node = new InformedDecisionTreeNode({ action, parent: this, heuristic: this.heuristic });
			this.children.push(node);
			return node;
		}
		path() {
			if (this.depth == 0) return [this];
			let path = this.parent.path();
			path.push(this);
			return path;
		}
		static compareInformedDecisionTreeNodes(a, b) {
			if (a.totalCostEstimate > b.totalCostEstimate) return 1;else if (a.totalCostEstimate < b.totalCostEstimate) return -1;
			return 0;
		}
	}

	// Ordered BFS queue by compare function
	class HOBFS extends Array {
		constructor(compareFn) {
			super();
			this.compare = compareFn;
		}
		push(...nodes) {
			super.push(...nodes);
			this.sort(this.compare);
			(0, _log.traceJSON)("HOBFS push: ", this.map(i => i.totalCostEstimate));
		}
		next() {
			return this.shift();
		}
	}

	exports.findOptimalSolutionIBFS = findOptimalSolutionIBFS;
	exports.InformedActionsTreeExpander = InformedActionsTreeExpander;
	exports.ConfigurableFunction = ConfigurableFunction;
	exports.default = findOptimalSolutionIBFS;

/***/ }
/******/ ]);