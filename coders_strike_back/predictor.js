import Pod from "./pod"
import Vector from "./vector"
import Point from "./point"
import {traceJSON, _TRACE} from "./log"
import { findOptimalSolution, DecisionTreeNode, SmartAction, ActionsTreeExpander } from "./findsolution"
import { findOptimalSolutionIBFS, InformedActionsTreeExpander, ConfigurableFunction } from "./informedsearch"

var loop = require("./track");

module.exports.predictOptions = predictOptions;

function predictOptions({pod, depth = 50, behaviour = 'optimal'}) {
	traceJSON("predictOptions ", arguments);
	let treeExpander 
//	if(behaviour === 'fastspeed')
//		treeExpander = new PodActionsFastSpeed(pod.checkpoint1, pod.checkpoint2);
//	else
		treeExpander = new PodActions(pod.checkpoint1, pod.checkpoint2);
	let res = findOptimalSolutionIBFS({
			initialState: pod, 
			treeExpander, 
			checkTarget: checkTarget.bind({target: pod.checkpoint2}), 
			heuristic: new PodEstimateTarget(pod.position, pod.checkpoint1, pod.checkpoint2),
			depthLimit: depth
		});
	return res;
}

//IMPLEMENT class actions:

function checkTarget (pod) {
	return pod.position.distance(this.target) < 600;
}


// Heuristic function with configuration stored
class PodEstimateTarget extends ConfigurableFunction {
	constructor(pos, p1, p2) {
		super();
		this.p1 = p1;
		this.p2 = p2;
        let angleCP2 = (new Vector(p1, p2)).angleToRad(new Vector(pos, p1));
		this.stepsToP2 = stepsToPoint(200 / .15, angleCP2, p1, p2) 
	}
	apply (pod) {
		let passedCheckpoint1 = pod.nextCheckpointId != this.p1.id;
//		const podToPoint = (p1, p2) => Math.max((p1.distance(p2) - 600) / 1300, 0)
		if(!passedCheckpoint1) {
			return podStepsToPoint(pod, this.p1) - 4 + this.stepsToP2;  //podToPoint(pod.position, this.p1); 
		} else {
			return podStepsToPoint(pod, this.p2); // podToPoint(pod.position, this.p2);
		}
	}
}

// On every state (pod position) search will try following actions, 
// branching search until it reaches target
class PodActionsFastSpeed extends ActionsTreeExpander {
	constructor(p1, p2) {
		super([
				new MoveToCheckpoint1({p1, p2, thrust: 100}),
				new MoveToCheckpoint1({p1, p2, thrust: 200}),
//				new MoveToCheckpoint1Compensate({p1, p2, thrust: 200}),
//				new MoveViaCheckpoint1({p1, p2, distance: 400, thrust: 100}),
//				new MoveViaCheckpoint1({p1, p2, distance: 400, thrust: 200}),
//				new MoveToCheckpoint2({p1, p2, thrust: 0}),
//				new MoveToCheckpoint2({p1, p2, thrust: 50}),
				new MoveToCheckpoint2({p1, p2, thrust: 200}),
				new MoveToCheckpoint2({p1, p2, thrust: 100})
			]);
	}
}

// On every state (pod position) search will try following actions, 
// branching search until it reaches target
class PodActions extends ActionsTreeExpander {
	constructor(p1, p2) {
		super([
				new MoveToCheckpoint1({p1, p2, thrust: 100}),
				new MoveToCheckpoint1({p1, p2, thrust: 200}),
//				new MoveToCheckpoint1Compensate({p1, p2, thrust: 200}),
//				new MoveViaCheckpoint1({p1, p2, distance: 400, thrust: 100}),
//				new MoveViaCheckpoint1({p1, p2, distance: 400, thrust: 200}),
				new MoveToCheckpoint2({p1, p2, thrust: 0}),
//				new MoveToCheckpoint2({p1, p2, thrust: 50}),
				new MoveToCheckpoint2({p1, p2, thrust: 200}),
				new MoveToCheckpoint2({p1, p2, thrust: 100})
			]);
	}
}


// Targetting pod directly to checkpoint1, until turned to checkpoint2
class MoveToCheckpoint1 extends SmartAction {
	constructor({p1, p2, thrust = 100}) {
		super({p1, p2, thrust});
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

		return loop.shadowPodMoveToTarget(Object.assign({pod}, aim));
	}
	isApplicable(node) {
		if(!node.action) return true;
		if(!this.isCompatible(node.action)) return false;
		if(this.thrust < node.action.thrust) return false;
		let pod = node.state;
		if(pod.nextCheckpointId != this.p1.id) return false;
		if((this.thrust == 200) && (Math.abs(pod.checkpoint1Angle) > 30)) return false;
		return goesOffCheckpoint1(node.parent) ? true : !goesOffCheckpoint1(node);
	}
	isCompatible(action) {
		return action.name == this.name;
	}
}


// Targetting pod near checkpoint1, to optimize turn to checkpoint2
class MoveViaCheckpoint1 extends MoveToCheckpoint1 {
	constructor({p1, p2, distance = 600, thrust = 100}) {
		super({p1, p2, thrust});
		this.distance = distance;
		this.name = "MoveViaCheckpoint1";
		this.P1P2 = new Vector(this.p1, this.p2)
	}
	apply(node) {
		let pod = node.state; 
		let podTarget = new Vector(pod.position, this.p1);
		let angle = podTarget.angleTo(this.P1P2)
		let shiftVector = podTarget
				.rotate(90 * Math.sign(angle))
				.scale(this.distance / podTarget.value());
//		console.log(`MoveViaCheckpoint1 angle ${angle} shift ${JSON.stringify(shiftVector)}`);
		let aim = pod.aimToTarget(this.p1.add(shiftVector), this.thrust);

		return loop.shadowPodMoveToTarget(Object.assign({pod}, aim));
	}
}


class MoveToCheckpoint2 extends SmartAction {
	constructor({p1, p2, thrust = 100}) {
		super({p1, p2, thrust});
		this.actionSteps = 3 + (200 - this.thrust) / 50;
		this.name = "MoveToCheckpoint2";
	}
	apply(node) {
		let pod = node.state; 
		//let aim = pod.aimToTarget(this.p2, this.thrust);
//		return loop.shadowPodMoveToTarget(Object.assign({pod}, aim));
		let passedCheckpoint1 = pod.nextCheckpointId != this.p1.id;
		let target = Object.assign({}, this.p2, {thrust: this.thrust});
		if(passedCheckpoint1) {
			target = pod.aimToCheckpoint1(this.thrust);
			// pod.checkpoint1 is this.p2 -- target checkpoint of this action
/*	        let angleToVelocity = pod.checkpoint1VelocityAngleRad * 180 / Math.PI;
	        // patch target when far and moving in wrong direction
	        if(Math.abs(angleToVelocity) < 90 && Math.abs(pod.checkpoint1Angle) < 90 && pod.checkpoint1Distance > 2000) 
	            target = target.rotate(pod.position, angleToVelocity);*/
		}
		return loop.shadowPodMoveToTarget(Object.assign({pod}, target));
	}
	isApplicable(node) {
		let pod = node.state; 
		if (pod.velocityValue < 100 && this.thrust == 0) return false;
//		if (passedCheckpoint1) 
//			return this.thrust == 200; // After checkpoint1 allow only full thrust
		if( pod.nextCheckpointId==this.p1.id && node.parent && goesOffCheckpoint1(node) )
			return false;
		// Further it can continue only with the same action configuration
		let precedingAction = node.action;
		if (precedingAction)
			if (precedingAction.name === this.name) {
//				if(node.parent.state.nextCheckpointId != pod.nextCheckpointId && this.thrust == 100) return true;
				if(precedingAction.thrust <= this.thrust) return true;
				else return false;
			}
		if(!node._stepsToCheckpoint1)
			node._stepsToCheckpoint1 = podStepsToPoint(pod, this.p1);
		traceJSON(`MoveToCheckpoint2 _stepsToCheckpoint1 = ${node._stepsToCheckpoint1}`, {});
		return (node._stepsToCheckpoint1 <= this.actionSteps); // && (stepsToCheckpoint1 > 3);
	}
}


// Accepts DecisionTreeNode structure and point to check direction
function goesOffCheckpoint1(node) {
	if(!node || !node.parent) return true;
	if(node.hasOwnProperty('_goesOffCheckpoint1'))
		return node._goesOffCheckpoint1;

	node._goesOffCheckpoint1 = function() {
		let prevPod = node.parent.state;
		let pod = node.state;
		if(prevPod.nextCheckpointId != pod.nextCheckpointId) return false;
		if(Math.abs(prevPod.checkpoint1VelocityAngleRad) >= Math.PI/2) return true;
		const checkpointIntersection = (pod) => pod.checkpoint1Distance * Math.abs(Math.tan(pod.checkpoint1VelocityAngleRad));
		let podIntersection =  checkpointIntersection(pod);
		traceJSON(`goesOffCheckpoint1 intersection ${podIntersection} for pod `, pod.position);
		return (podIntersection > 800) && (checkpointIntersection(prevPod) < podIntersection);
	}()
	return node._goesOffCheckpoint1;
}

const podStepsToPoint = (pod, point) =>
	stepsToPoint(pod.velocityValue, pod.directionStats(point).angle, pod.position, point);

function stepsToPoint(initialVelocity, initialAngle, pos, point) {
	let steps = 0;
	let distanceIter = distance(pos.distance(point), 
						velocity(initialVelocity *  Math.cos(initialAngle), 
								acceleration( angle( initialAngle ) )
							)
						)
	while ( (distanceIter.next().value > 600) && (steps < 50) ) steps++;
	return steps;
}


function* angle(initialAngle) {
	let angle = Math.abs(initialAngle * Math.PI / 180);
	yield angle;
	while (true) yield (angle > 0) ? (angle -= Math.PI/10) : 0;
}

function* acceleration( alpha ) {
	while(true) yield Math.max(Math.cos(alpha.next().value) * 200, 0);
} 

function* velocity( initialVelocity, acceleration ) {
	let velocity = initialVelocity;
	yield velocity;
	while(true) yield velocity = velocity * .85 + acceleration.next().value;
} 

function* distance(start, velocity) {
	let distance = start;
	yield distance;
	while (true) yield distance -= velocity.next().value;
} 


export default predictOptions;
