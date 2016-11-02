"use strict";

var _pod = require("./pod");

var _pod2 = _interopRequireDefault(_pod);

var _point = require("./point");

var _point2 = _interopRequireDefault(_point);

var _vector = require("./vector");

var _vector2 = _interopRequireDefault(_vector);

var _log = require("./log");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require("./config");

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