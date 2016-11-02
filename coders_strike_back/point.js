var _degreeToRadians = 180/Math.PI;

class Point {

// Point always has integer coordinates
	constructor (x, y) {
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
	    if (angle > 0)
	        angle = 2*Math.PI - angle;
	    else if (angle < 0)
	        angle *= -1;
	        
	    return angle * _degreeToRadians;
	}
}


// Unfortunately ES6 does not support static members of the class, workaround:
Point._zeroPoint = new Point(0, 0);

export default Point