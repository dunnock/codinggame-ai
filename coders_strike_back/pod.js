import Vector from "./vector"
import Point from "./point"
import predictOptions from './predictor'
import {traceJSON, _TRACE} from './log'

var readline, printErr, trackConfig;

class Pod {
// Pod functions

    constructor(iface, track, id) {
        this.totalCheckpoints = 0;
        this.id = id;
        this.generation = 1;
        this.collisions = [];
        if(iface) ({readline, printErr} = iface);
        if(track) trackConfig = track;
    }

    read() {
        var input=readline();
        var [x, y, vx, vy, a, cid] = input.split(' ').map(toInt);
        //validate:
        if(typeof cid == "undefined") throw new Error("incorrect input string for Pod (no checkpoint): " + input);
        //init

        this.position = new Point(x, y);
        this.velocity = new Vector(new Point(vx, vy));
        this.velocityValue = this.velocity.value();
        this.angleX = a;
        this.orientation = Vector._horizonVector.rotate(this.angleX);
        this.nextCheckpointUpdated = (this.nextCheckpointId != cid);
        this.nextCheckpointId = cid;
        this.updateCheckpoint();
        return this;
    }

    updateCheckpoint() {
        if(this.nextCheckpointUpdated) {
            this.checkpoint1 = trackConfig.checkpoints[this.nextCheckpointId];
            this.checkpoint1.id = this.nextCheckpointId;
            this.checkpoint2 = trackConfig.checkpoints[(this.nextCheckpointId+1) % trackConfig.numCheckpoints];
            this.totalCheckpoints++;
            this.collisions = [];
        }
        this.checkpoint1Vector = new Vector(this.position, this.checkpoint1);
        this.checkpoint1Distance = this.checkpoint1Vector.value();
        this.checkpoint1Angle = this.orientation.angleTo(this.checkpoint1Vector);
        this.checkpoint1VelocityAngleRad = this.checkpoint1Vector.angleToRad(this.velocity);
        this.checkpoint2Vector = new Vector(this.position, this.checkpoint2);
        this.checkpoint2Distance = this.checkpoint2Vector.value();
        this.checkpoint2Angle = this.orientation.angleTo(this.checkpoint2Vector)
        return this;
    }

    duplicateAndInit({position, vx, vy, angle, nextCheckpointId, target}) {
        let velocity = new Vector(new Point(vx, vy));
        var pod = Object.assign(
            new Pod(false, false, this.id), 
            {
                position, 
                velocity,
                velocityValue: velocity.value(),
                angleX: angle,
                orientation: Vector._horizonVector.rotate(angle),
                nextCheckpointId,
                nextCheckpointUpdated: nextCheckpointId != this.nextCheckpointId,
                target,
                totalCheckpoints: this.totalCheckpoints,
                id: this.id,
                generation: this.generation+1,
                checkpoint1: this.checkpoint1,
                checkpoint2: this.checkpoint2
                });
        return pod;
    }


    // return relative stats from pod to point {distance, angle, velocityAngle}
    relativeStats(p) {
        var res = {};
        res.vector = new Vector(this.position, p);
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
        res.vector = new Vector(this.position, p);
        res.angle = res.vector.angleToRad(this.orientation); //angleX is relative angle
        
        return res;
    }

    // return relative stats from pod to point {distance, angle, velocityAngle}
    velocityStats(p) {
        var res = {};
        res.vector = new Vector(this.position, p);
        res.angle = res.vector.angleToRad(this.velocity); //angleX is relative angle
        res.velocityInDirection = this.velocityValue * Math.cos(res.angle);
        
        return res;
    }

    // calculated optimal direction and thrust of pod to move to the target Point
    // returns {x, y, thrust}
    aimToTarget(target, recommendedThrust = 100) {
        let targStat = this.directionStats(target);
        let thrust = (Math.abs(targStat.angle) > Math.PI/2) ? 0 : recommendedThrust; // Math.round(100*Math.cos(cpAngleRad/6));

//        if (!boostUsed && p1Stat.angleAbs < 10 && p1Stat.distance > 5000) {
//            thrust = "BOOST";
//            boostUsed = true;
//        }

        return Object.assign({thrust: thrust}, target);
    }

    aimToCheckpoint1(recommendedThrust = 100) {
        let thrust = (Math.abs(this.checkpoint1Angle) > 90) ? 0 : recommendedThrust; // Math.round(100*Math.cos(cpAngleRad/6));
        let target = this.checkpoint1;

        let angleVelocity = this.checkpoint1VelocityAngleRad * 180 / Math.PI;
        if(Math.abs(angleVelocity) < 90 && Math.abs(this.checkpoint1Angle) < 90) 
            target = target.rotate(this.position, angleVelocity);

        return Object.assign({thrust: thrust}, target);
    }

    distance(poi) {
        if(poi instanceof Point)
            return this.position.distance(poi);
        else if(poi instanceof Pod)
            return this.position.distance(poi.position);
        else if(poi.x && poi.y)
            return this.position.distance(poi);
    }

    // calculated optimal direction and thrust of pod to move to the Point p1 
    // considering that after reaching p1 it has to move towards p2
    // returns {x: x, y: y, thrust: thrust}
    optimalMoveAI(hisPods = []) {
        if(this.enemy && this.runAwayFromEnemy() )
            return this.target;
        if (this.velocityValue>400 & this.avoidCollision(hisPods, 5, false, this.checkpoint1Vector))
            return this.target;
        if (this.velocityValue<1000 && this.totalCheckpoints<trackConfig.totalCheckpointsLaps) {
            let options = {pod: this, depth: 50};
            if(this.enemy && this.enemy.distance(this) < 3000) options.behaviour = 'fastspeed';
            let res = predictOptions(options);
            let node = res.result.node;
            if(node && node.parent) {
                this.target = node.path()[1].state.target;
                traceJSON(`optimalMoveAI (depth = ${node.depth}): `, node.path()[1], _TRACE);
                return this.target;
            }
        }
        this.target = this.optimalMove();
        return this.target;
    }

    runAwayFromEnemy() {
        if(!this.enemy) return false;
        let enemyVector = new Vector(this.position, this.enemy.position);
        let angleEnemyToCheckpoint = this.checkpoint1Vector.angleTo(enemyVector);
        traceJSON(`runAwayFromEnemy angle ${angleEnemyToCheckpoint}`, this.relativeStats(this.enemy.position), _TRACE);
        if(this.enemy.distance(this) > 2000 ||
            this.enemy.distance(this) > this.checkpoint1Distance ||
            this.enemy.distance(this.checkpoint1) > this.checkpoint1Distance ||
            Math.abs(angleEnemyToCheckpoint) > 60)
            return false;
        this.target = this.position.add(
                enemyVector.rotate(
                    Math.sign(angleEnemyToCheckpoint) * 90));
        this.target.thrust = 200;
        traceJSON(`runAwayFromEnemy target `, this.target, _TRACE);
        return true;
    }

    // calculated optimal direction and thrust of pod to move to the Point p1 
    // considering that after reaching p1 it has to move towards p2
    // returns {x: x, y: y, thrust: thrust}
    optimalMove() {
        let p1 = this.checkpoint1;
        let p2 = this.checkpoint2;
        traceJSON("podOptimalMove: ", this, _TRACE);
        let p1Stat = this.relativeStats(p1);

        let thrust = 0;
        if ((Math.abs(this.checkpoint1Angle)<90 && this.velocityValue < 400) || Math.abs(this.checkpoint1Angle)<45)
            thrust = 100;
        if ( Math.abs(this.checkpoint1Angle)<15 || 
            ( Math.abs(this.checkpoint1Angle) < 60 && Math.abs(this.checkpoint1Angle) > 15 &&
            Math.sign(this.checkpoint1Angle) != Math.sign(-this.checkpoint1VelocityAngleRad) ) )
                thrust = 200; 

        let target = p1;

        let targStat = this.relativeStats(target);

        // patch target when far and moving in wrong direction
        if(targStat.angleVelocityAbs < 90 && targStat.angleAbs < 90) 
            target = target.rotate(this.position, targStat.angleVelocity);

//        if (!boostUsed && p1Stat.angleAbs < 10 && p1Stat.distance > 5000) {
//            thrust = "BOOST";
//            boostUsed = true;
//        }

        this.target = Object.assign({thrust: thrust}, target);

        return this.target;
    }


    avoidCollision(hisPods = [], steps = 3, allCollisions = false, intentVec) {
        if(!hisPods.length) return false;
        if(!intentVec) intentVec = this.velocity;
        let pods = hisPods.map(pod => ({pod, angle: pod.velocity.angleTo(intentVec)}));
        if(!allCollisions) 
            pods = pods.filter(i => Math.abs(i.angle) > 60);
        let positions = [];
        let myPos = [...(this.extrapolatePositions(steps))];
        pods.map(podR => 
                ([...podR.pod.extrapolatePositions(steps)].map((position, i) => 
                    ({  i, position, pod: podR.pod, angle: podR.angle, 
                        distance: position.distance(myPos[i])}))))
            .forEach(podsR => positions.push(...podsR));
        let collisions = positions
            .filter(i => i.distance < 800)
            .filter(i => i.position.distance(this.position) < (this.checkpoint1Distance-200));
        traceJSON(`avoidCollision positions distances [${steps}]`, positions.map(i => i.distance));
        if (collisions.length) {
            let intersectAngle = collisions[0].angle;
            let angle = Math.sign(intersectAngle) * 90;
            traceJSON(`avoidCollision velocitiesAngle ${intersectAngle} rotate by `, angle, _TRACE);
            let thrust = 200;
            if(this.checkpoint1Distance < 1500) thrust = 50;
            this.target = this.position.add(this.orientation.scale(100).rotate(angle));
            this.target.thrust = thrust;
            return true;
        }
        return false;
    }

    huntMove(friendlyPods = []) {
        if(this.superAim) return Object.assign({thrust: 200}, this.huntCalcTarget(this.superAim));
        if(!this.aim) return Object.assign({thrust: 200}, this.checkpoint2);
        var target = {thrust: 200};
        var targetPod = this.aim;
        traceJSON("hunting target ", targetPod);
        var targetDistance = this.position.distance(targetPod.position);
        //TODO: avoid hitting own pod
        if(friendlyPods.length) {
            if(this.avoidCollision(friendlyPods, 7, true))
                return Object.assign(this.target, {thrust: 50})
            else if(this.position.distance(friendlyPods[0].position)<1000)
                target.thrust = 50;
        }

/*        if(targetDistance<1400) // attack!!!
            Object.assign(target, targetPod.position);
        else */if(this.isMovingTowardsMe(targetPod) || 
                (targetDistance<2000 && this.velocityValue>targetPod.velocityValue))
            Object.assign(target, this.huntCalcTarget(targetPod));
        else {
            Object.assign(target, targetPod.checkpoint2.add((new Vector(targetPod.checkpoint1, targetPod.checkpoint2)).scale(.2)));
            if (this.distance(target) < 5000) { 
                target = Object.assign({}, targetPod.checkpoint1);
                if(Math.abs(this.orientation.angleTo(target))>90)
                    target.thrust = 0; 
                else 
                    target.thrust = 100; 
            }
            traceJSON(`huntMove to checkpoint2 distance ${this.distance(target)} `, target, _TRACE);
        }
    //    printErr("turns to target: " + Math.ceil(targetDistance/(targetPod.velocity.value+1)) + " velocity " + targetPod.velocity.value);
        return target;
    }

    huntCalcTarget(targetPod) {
        let tStat = this.relativeStats(targetPod.position);
        let target = targetPod.position;
//        if(tStat.distance>1400) {
            target = targetPod.extrapolatePosition(Math.round(tStat.distance/2/(targetPod.velocityValue+1)));
            if(Math.abs(targetPod.velocity.angleTo(targetPod.orientation))<20) {
                if(tStat.distance > 3000 && tStat.angleVelocityAbs < 90)
                    target = target.rotate(this.position, tStat.angleVelocity);
                else if(tStat.distance > 3000 && tStat.angleVelocityAbs < 120)
                    target = target.rotate(this.position, tStat.angleVelocity/2);
            }
            if(tStat.angleAbs>90) target.thrust = 0;
            else if(tStat.angleAbs>45) target.thrust = 50;
//        }
        return target
    }

    extrapolatePosition(turns) {
        var intentVector = new Vector(this.position, this.checkpoint1);
        
//        var accelerationImpact = (1 + turns) * turns / 2 * Math.pow(.85, turns-1);

        return this.position.add(this.velocity.scale(turns))
            .add( intentVector.scale(50 / intentVector.value() * turns) )  //add thrust approximation
            .add( this.orientation.scale(turns) );  //add orientation approximation
    }

    *extrapolatePositions(turns) {
        var position = this.position;
        var velocity = this.velocity;
        var thrust = this.orientation.scale(2); // consider thrust 100
        let i = turns;
        while(i--) {
            velocity = velocity.add(thrust);
            yield position = position.add(velocity);
            velocity = velocity.scale(0.85);
        }
    }


    isMovingTowardsMe(pod) {
        var intentVector = new Vector(pod.position, pod.checkpoint1);
        var podToThisVector = new Vector(pod.position, this.position);
        return Math.abs(intentVector.angleTo(podToThisVector))<60 ||
                Math.abs(pod.orientation.angleTo(podToThisVector))<60;
    }

    // returns collision impact 0-1, 0 for no collision, 1 for strongest
    collisionImpact(pods) {
        for(var i in pods) {
            var pod = pods[i];
            var collisionDistance = this.position.add(this.velocity).add(this.orientation)
                .distance(pod.position.add(pod.velocity).add(pod.orientation));
            if (collisionDistance<800) {
                var impact = (this.velocityValue+pod.velocityValue)/1000*Math.abs(this.velocity.angleTo(pod.velocity))/45;
                traceJSON(`Collision distance: ${collisionDistance} impact ${impact}`, pod, _TRACE);
                this.collisions[pod.id] = this.collisions[pod.id] ? this.collisions[pod.id]+1 : 1;
                if(this.collisions[pod.id]>2) {
                    traceJSON("RED ALERT!!! Avoid ", pod, _TRACE);
                    this.avoidEnemy(pod);
                }
                return impact;
            }
        }
        return 0
    }

    avoidEnemy(pod) {
        this.enemy = pod;
    }

    //pick the leader for chasing
    pickOptimalTarget(pods) {
        if(this.superAim) { this.aim = this.superAim; return this }
        let aim = this.aim;
        if(!aim) aim = pods[0];
        for(var i in pods)
            if(pods[i].totalCheckpoints>aim.totalCheckpoints)
                aim = pods[i];

        if(this.aim && this.distance(this.aim)<2000 && this.aim.totalCheckpoints>(aim.totalCheckpoints-1) ) 
            return this;
                
        this.aim = aim;
        printErr(`Pick target: ${JSON.stringify(this.aim)}`);
        return this;
    }

    attack(enemyPod) {
        if(!this.superAim)
            this.superAim = enemyPod;
    }

    calculateMove(intentVector, thrust) {
        var intentAngle = Math.round(intentVector.angle());
        var angle = intentAngle - this.angleX; // Angle might change by 18
        if (angle>180) angle -= 360;
        if (angle<-180) angle += 360;
        if (angle>18) angle = 18;
        else if (angle < -18) angle = -18;
        angle += this.angleX;
        angle %= 360;
        if (angle<0) angle += 360;

//        printErr(`calculateMove position ${JSON.stringify(this.position)} intent ${JSON.stringify(intentVector)} intentAngle ${intentAngle} angle ${angle} this.angleX ${this.angleX}`);

        var thrustVector = Vector._horizonVector.rotate(angle).scale(thrust / 100);

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
        return (pod.position.distance(this.position) < 100) &&
            (pod.velocity.angleTo(this.velocity) < 1);
    }

}


function toInt(s) {
    return parseInt(s);
}


export default Pod