import Point from "./point"

var _degreeToRadians = 180/Math.PI;


class Vector {
    // Note: vector might have float coordinates
    constructor(p1, p2) {
        if(!p2) { 
            this.x = p1.x; 
            this.y = p1.y;
        } else {
            this.x = p2.x - p1.x;
            this.y = p2.y - p1.y;
        }
    }


    add(v) {
        return new Vector(new Point(this.x + v.x, this.y + v.y));
    }

    scale(s) {
        return new Vector(new Point(this.x*s, this.y*s));
    }

    rotate(angle) {
        var angleRad = angle / _degreeToRadians;
        var rotatedX = this.x * Math.cos(angleRad) - this.y * Math.sin(angleRad);
        var rotatedY = this.x * Math.sin(angleRad) + this.y * Math.cos(angleRad);
        return new Vector(new Point(rotatedX, rotatedY));
    }

    angleTo(v2) {
        var angleV1 = Math.atan2(-this.y, this.x);
        var angleV2 = Math.atan2(-v2.y, v2.x);

        var delta = angleV2-angleV1;
        if (delta > Math.PI)
            delta -= Math.PI*2;
        else if (delta < -Math.PI)
            delta += Math.PI*2;

        return delta * _degreeToRadians;
    }

    angleToRad(v2) {
        var angleV1 = Math.atan2(-this.y, this.x);
        var angleV2 = Math.atan2(-v2.y, v2.x);

        var delta = angleV2-angleV1;
        if (delta > Math.PI)
            delta -= Math.PI*2;
        else if (delta < -Math.PI)
            delta += Math.PI*2;

        return delta;
    }

    angle() {
        var angle = Math.atan2(-this.y, this.x);
        if (angle > 0)
            angle = 2*Math.PI - angle;
        else if (angle < 0)
            angle *= -1;
            
        return angle * _degreeToRadians;
    }

    value() {
        return Math.hypot(this.x, this.y);
    }
}

// Unfortunately ES6 does not support static members of the class, workaround:
Vector._horizonVector = new Vector(new Point(100, 0));

export default Vector