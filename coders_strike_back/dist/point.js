"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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