class Sonic {
	constructor(pos, bombsLeft, bombsRadius, bombRecover = 8) {
		this.x = pos.x;
		this.y = pos.y;
		this.bombsLeft = bombsLeft;
		this.bombsRadius = bombsRadius;
		this.bombRecover = bombRecover;
		if(bombRecover == 0) {
			this.bombsLeft = 1;
			this.bombRecover = 8;
		}
	}
	clone() {
        return Object.assign(Object.create(this), this);
	}
	// Immutable move, returns new Sonic instance
	move(cell) {
		return new Sonic(cell, this.bombsLeft, this.bombsRadius, this.bombRecover - (this.bombsLeft ? 0 : 1));
	}
	wait() {
		return new Sonic(this, this.bombsLeft, this.bombsRadius, this.bombRecover - (this.bombsLeft ? 0 : 1));
	}
    at(pos) {
        return this.x == pos.x && this.y == pos.y;
    }
}

export default Sonic