// This is example implementation of Cell and Player objects for codinggame 2.5D Maze

import Player from './player'
import Arena from './arena'

/*
* "." floor
* "+" short wall
* "|" vertical slope
* "-" horizontal slope
* "#" high wall
* "X" bridge
*/

const _traversable = {
		'..':(p1,p2)=>true,
		'.X':(p1,p2)=>true,
		'X.':(p1,p2)=>true,
		'.|':(p1,p2)=>Math.abs(p1.y-p2.y)==1,
		'|.':(p1,p2)=>Math.abs(p1.y-p2.y)==1,
		'.-':(p1,p2)=>Math.abs(p1.x-p2.x)==1,
		'-.':(p1,p2)=>Math.abs(p1.x-p2.x)==1,
		'++':(p1,p2)=>true,
		'+X':(p1,p2)=>true,
		'X+':(p1,p2)=>true,
		'+|':(p1,p2)=>Math.abs(p1.y-p2.y)==1,
		'|+':(p1,p2)=>Math.abs(p1.y-p2.y)==1,
		'+-':(p1,p2)=>Math.abs(p1.x-p2.x)==1,
		'-+':(p1,p2)=>Math.abs(p1.x-p2.x)==1,
		'X|':(p1,p2)=>Math.abs(p1.y-p2.y)==1,
		'|X':(p1,p2)=>Math.abs(p1.y-p2.y)==1,
		'X-':(p1,p2)=>Math.abs(p1.x-p2.x)==1,
		'-X':(p1,p2)=>Math.abs(p1.x-p2.x)==1
	}

const _celllevel = {'.':1,'+':2, '|':3, '-':3, 'X':3} // other cells have variable level or impossible to move over

// Cell class provides definition of cell types traversability
class MazePlayer extends Player {
	constructor (x,y,cell) {
		super(x,y)
		this.level = _celllevel[cell.type] || 1
		this.key = `x${x}y${y}l${this.level}`
		this.type = cell.type
	}
	canMoveTo(cell) {
		let condition = _traversable[this.type + cell.type]
		return condition===true || condition && condition(this,cell)
	}
	move(cell) {
		let player = super.move(cell)
		player.type=cell.type
		let cellLevel = _celllevel[cell.type]
		if(cellLevel) player.level=cellLevel
		return player
	}
}

class MazeArena extends Arena {
	constructor (textFields, playerx, playery, exitx, exity) {
		super(textFields[0].length, textFields.length, textFields)
		this.player = new MazePlayer(playerx, playery, this.cellXY(playerx, playery))
		this.exit = this.cellXY(exitx, exity)
	}
    // Immutable method, returns new Arena with updated player position
    movePlayer(pos) {
        let arena = this.clone(true, false);
        arena.player = this.player.move(pos)
        return arena
    }
    cellsAroundPlayer() {
        return this.cellsAroundXY(this.player.x, this.player.y)
    }
    playerCell() {
        return this.cell(this.player)
    }
    clone(cloneTable = false, clonePlayer = false) {
    	let bf = super.clone(cloneTable)
        bf.player = clonePlayer ? this.player.clone() : this.player
        bf.exit = this.exit 
        return bf;
    }
    toString() { 
        return this.field.map((r,y) => 
        	r.split('').map((c,x) => 
        		c + (this.player.at({x,y})?'P':(this.exit.at({x,y})?'E':' '))).join('')).join('\n')
    }
}


export {MazePlayer, MazeArena}
export default MazeArena
