"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _point = require("./point");

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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