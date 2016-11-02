"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vector = require("./vector");

var _vector2 = _interopRequireDefault(_vector);

var _point = require("./point");

var _point2 = _interopRequireDefault(_point);

var _predictor = require("./predictor");

var _predictor2 = _interopRequireDefault(_predictor);

var _log = require("./log");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        value: function duplicateAndInit(_ref) {
            var position = _ref.position;
            var vx = _ref.vx;
            var vy = _ref.vy;
            var angle = _ref.angle;
            var nextCheckpointId = _ref.nextCheckpointId;
            var target = _ref.target;

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
            if (poi instanceof _point2.default) return this.position.distance(poi);else if (poi instanceof Pod) return this.position.distance(poi.position);else if (poi.x && poi.y) return this.position.distance(poi);
        }

        // calculated optimal direction and thrust of pod to move to the Point p1 
        // considering that after reaching p1 it has to move towards p2
        // returns {x: x, y: y, thrust: thrust}

    }, {
        key: "optimalMoveAI",
        value: function optimalMoveAI() {
            var hisPods = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

            if (this.enemy && this.runAwayFromEnemy()) return this.target;
            if (this.velocityValue > 400 & this.avoidCollision(hisPods, 5, false, this.checkpoint1Vector)) return this.target;
            if (this.velocityValue < 1000 && this.totalCheckpoints < trackConfig.totalCheckpointsLaps) {
                var options = { pod: this, depth: 50 };
                if (this.enemy && this.enemy.distance(this) < 3000) options.behaviour = 'fastspeed';
                var res = (0, _predictor2.default)(options);
                var node = res.result.node;
                if (node && node.parent) {
                    this.target = node.path()[1].state.target;
                    (0, _log.traceJSON)("optimalMoveAI (depth = " + node.depth + "): ", node.path()[1], _log._TRACE);
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
            var angleEnemyToCheckpoint = this.checkpoint1Vector.angleTo(enemyVector);
            (0, _log.traceJSON)("runAwayFromEnemy angle " + angleEnemyToCheckpoint, this.relativeStats(this.enemy.position), _log._TRACE);
            if (this.enemy.distance(this) > 2000 || this.enemy.distance(this) > this.checkpoint1Distance || this.enemy.distance(this.checkpoint1) > this.checkpoint1Distance || Math.abs(angleEnemyToCheckpoint) > 60) return false;
            this.target = this.position.add(enemyVector.rotate(Math.sign(angleEnemyToCheckpoint) * 90));
            this.target.thrust = 200;
            (0, _log.traceJSON)("runAwayFromEnemy target ", this.target, _log._TRACE);
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
            (0, _log.traceJSON)("podOptimalMove: ", this, _log._TRACE);
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
                var angle = Math.sign(intersectAngle) * 90;
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
                (0, _log.traceJSON)("huntMove to checkpoint2 distance " + this.distance(target) + " ", target, _log._TRACE);
            }
            //    printErr("turns to target: " + Math.ceil(targetDistance/(targetPod.velocity.value+1)) + " velocity " + targetPod.velocity.value);
            return target;
        }
    }, {
        key: "huntCalcTarget",
        value: function huntCalcTarget(targetPod) {
            var tStat = this.relativeStats(targetPod.position);
            var target = targetPod.position;
            //        if(tStat.distance>1400) {
            target = targetPod.extrapolatePosition(Math.round(tStat.distance / 2 / (targetPod.velocityValue + 1)));
            if (Math.abs(targetPod.velocity.angleTo(targetPod.orientation)) < 20) {
                if (tStat.distance > 3000 && tStat.angleVelocityAbs < 90) target = target.rotate(this.position, tStat.angleVelocity);else if (tStat.distance > 3000 && tStat.angleVelocityAbs < 120) target = target.rotate(this.position, tStat.angleVelocity / 2);
            }
            if (tStat.angleAbs > 90) target.thrust = 0;else if (tStat.angleAbs > 45) target.thrust = 50;
            //        }
            return target;
        }
    }, {
        key: "extrapolatePosition",
        value: function extrapolatePosition(turns) {
            var intentVector = new _vector2.default(this.position, this.checkpoint1);

            //        var accelerationImpact = (1 + turns) * turns / 2 * Math.pow(.85, turns-1);

            return this.position.add(this.velocity.scale(turns)).add(intentVector.scale(50 / intentVector.value() * turns)) //add thrust approximation
            .add(this.orientation.scale(turns)); //add orientation approximation
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
            var podToThisVector = new _vector2.default(pod.position, this.position);
            return Math.abs(intentVector.angleTo(podToThisVector)) < 60 || Math.abs(pod.orientation.angleTo(podToThisVector)) < 60;
        }

        // returns collision impact 0-1, 0 for no collision, 1 for strongest

    }, {
        key: "collisionImpact",
        value: function collisionImpact(pods) {
            for (var i in pods) {
                var pod = pods[i];
                var collisionDistance = this.position.add(this.velocity).add(this.orientation).distance(pod.position.add(pod.velocity).add(pod.orientation));
                if (collisionDistance < 800) {
                    var impact = (this.velocityValue + pod.velocityValue) / 1000 * Math.abs(this.velocity.angleTo(pod.velocity)) / 45;
                    (0, _log.traceJSON)("Collision distance: " + collisionDistance + " impact " + impact, pod, _log._TRACE);
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