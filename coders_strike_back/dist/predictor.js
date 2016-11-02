"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pod = require("./pod");

var _pod2 = _interopRequireDefault(_pod);

var _vector = require("./vector");

var _vector2 = _interopRequireDefault(_vector);

var _point = require("./point");

var _point2 = _interopRequireDefault(_point);

var _log = require("./log");

var _findsolution = require("./findsolution");

var _informedsearch = require("./informedsearch");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [angle, acceleration, velocity, distance].map(regeneratorRuntime.mark);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var loop = require("./track");

module.exports.predictOptions = predictOptions;

function predictOptions(_ref) {
	var pod = _ref.pod;
	var _ref$depth = _ref.depth;
	var depth = _ref$depth === undefined ? 50 : _ref$depth;
	var _ref$behaviour = _ref.behaviour;
	var behaviour = _ref$behaviour === undefined ? 'optimal' : _ref$behaviour;

	(0, _log.traceJSON)("predictOptions ", arguments);
	var treeExpander = void 0;
	if (behaviour === 'fastspeed') treeExpander = new PodActionsFastSpeed(pod.checkpoint1, pod.checkpoint2);else treeExpander = new PodActions(pod.checkpoint1, pod.checkpoint2);
	var res = (0, _informedsearch.findOptimalSolutionIBFS)({
		initialState: pod,
		treeExpander: treeExpander,
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

var PodEstimateTarget = function (_ConfigurableFunction) {
	_inherits(PodEstimateTarget, _ConfigurableFunction);

	function PodEstimateTarget(pos, p1, p2) {
		_classCallCheck(this, PodEstimateTarget);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PodEstimateTarget).call(this));

		_this.p1 = p1;
		_this.p2 = p2;
		var angleCP2 = new _vector2.default(p1, p2).angleToRad(new _vector2.default(pos, p1));
		_this.stepsToP2 = stepsToPoint(200 / .15, angleCP2, p1, p2);
		return _this;
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


var PodActionsFastSpeed = function (_ActionsTreeExpander) {
	_inherits(PodActionsFastSpeed, _ActionsTreeExpander);

	function PodActionsFastSpeed(p1, p2) {
		_classCallCheck(this, PodActionsFastSpeed);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(PodActionsFastSpeed).call(this, [new MoveToCheckpoint1({ p1: p1, p2: p2, thrust: 100 }), new MoveToCheckpoint1({ p1: p1, p2: p2, thrust: 200 }),
		//				new MoveToCheckpoint1Compensate({p1, p2, thrust: 200}),
		//				new MoveViaCheckpoint1({p1, p2, distance: 400, thrust: 100}),
		//				new MoveViaCheckpoint1({p1, p2, distance: 400, thrust: 200}),
		//				new MoveToCheckpoint2({p1, p2, thrust: 0}),
		//				new MoveToCheckpoint2({p1, p2, thrust: 50}),
		new MoveToCheckpoint2({ p1: p1, p2: p2, thrust: 200 }), new MoveToCheckpoint2({ p1: p1, p2: p2, thrust: 100 })]));
	}

	return PodActionsFastSpeed;
}(_findsolution.ActionsTreeExpander);

// On every state (pod position) search will try following actions, 
// branching search until it reaches target


var PodActions = function (_ActionsTreeExpander2) {
	_inherits(PodActions, _ActionsTreeExpander2);

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


var MoveToCheckpoint1 = function (_SmartAction) {
	_inherits(MoveToCheckpoint1, _SmartAction);

	function MoveToCheckpoint1(_ref2) {
		var p1 = _ref2.p1;
		var p2 = _ref2.p2;
		var _ref2$thrust = _ref2.thrust;
		var thrust = _ref2$thrust === undefined ? 100 : _ref2$thrust;

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
           	&& pod.velocityValue > 400 ) 
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

	function MoveViaCheckpoint1(_ref3) {
		var p1 = _ref3.p1;
		var p2 = _ref3.p2;
		var _ref3$distance = _ref3.distance;
		var distance = _ref3$distance === undefined ? 600 : _ref3$distance;
		var _ref3$thrust = _ref3.thrust;
		var thrust = _ref3$thrust === undefined ? 100 : _ref3$thrust;

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

var MoveToCheckpoint2 = function (_SmartAction2) {
	_inherits(MoveToCheckpoint2, _SmartAction2);

	function MoveToCheckpoint2(_ref4) {
		var p1 = _ref4.p1;
		var p2 = _ref4.p2;
		var _ref4$thrust = _ref4.thrust;
		var thrust = _ref4$thrust === undefined ? 100 : _ref4$thrust;

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
			if (pod.velocityValue < 100 && this.thrust == 0) return false;
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
	return stepsToPoint(pod.velocityValue, pod.directionStats(point).angle, pod.position, point);
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
	return regeneratorRuntime.wrap(function angle$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					angle = Math.abs(initialAngle * Math.PI / 180);
					_context.next = 3;
					return angle;

				case 3:
					if (!true) {
						_context.next = 8;
						break;
					}

					_context.next = 6;
					return angle > 0 ? angle -= Math.PI / 10 : 0;

				case 6:
					_context.next = 3;
					break;

				case 8:
				case "end":
					return _context.stop();
			}
		}
	}, _marked[0], this);
}

function acceleration(alpha) {
	return regeneratorRuntime.wrap(function acceleration$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					if (!true) {
						_context2.next = 5;
						break;
					}

					_context2.next = 3;
					return Math.max(Math.cos(alpha.next().value) * 200, 0);

				case 3:
					_context2.next = 0;
					break;

				case 5:
				case "end":
					return _context2.stop();
			}
		}
	}, _marked[1], this);
}

function velocity(initialVelocity, acceleration) {
	var velocity;
	return regeneratorRuntime.wrap(function velocity$(_context3) {
		while (1) {
			switch (_context3.prev = _context3.next) {
				case 0:
					velocity = initialVelocity;
					_context3.next = 3;
					return velocity;

				case 3:
					if (!true) {
						_context3.next = 8;
						break;
					}

					_context3.next = 6;
					return velocity = velocity * .85 + acceleration.next().value;

				case 6:
					_context3.next = 3;
					break;

				case 8:
				case "end":
					return _context3.stop();
			}
		}
	}, _marked[2], this);
}

function distance(start, velocity) {
	var distance;
	return regeneratorRuntime.wrap(function distance$(_context4) {
		while (1) {
			switch (_context4.prev = _context4.next) {
				case 0:
					distance = start;
					_context4.next = 3;
					return distance;

				case 3:
					if (!true) {
						_context4.next = 8;
						break;
					}

					_context4.next = 6;
					return distance -= velocity.next().value;

				case 6:
					_context4.next = 3;
					break;

				case 8:
				case "end":
					return _context4.stop();
			}
		}
	}, _marked[3], this);
}

exports.default = predictOptions;