class Player {
	constructor(x,y) {
		Object.assign(this, {x,y})
	}
	clone() {
        return Object.assign(Object.create(this), this);
	}
	// Immutable move, returns new Player instance
	move(cell) {
		return Object.assign(this.clone(), {x:cell.x, y:cell.y});
	}
    at(pos) {
        return this.x == pos.x && this.y == pos.y;
    }
}

export default Player