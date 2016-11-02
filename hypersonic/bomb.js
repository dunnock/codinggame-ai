class Bomb {
	constructor(pos, radius, timeleft = 8) {
		this.x = pos.x;
		this.y = pos.y;
		this.radius = radius;
		this.timeleft = timeleft;
	}
	// Immutable move, returns new Sonic instance
	wait() {
		return new Sonic(this, this.radius, this.timeleft - 1);
	}
	isSuperDanger() {
		return this.timeleft < 5;
	}
    at(pos) {
        return this.x == pos.x && this.y == pos.y;
    }
}

export default Bomb