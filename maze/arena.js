// General class, reusable in all 2D mazes implementations
// Arena is a multiline text representation of the battlefield, where 
//  - every character represents type of the cell
//  - player is a subtype of Player

const MAXWIDTHSHIFT = 14

class Arena {
    constructor(width, height, field, objects) {
        Object.assign(this, {width,height,field}, objects)
    }
    //Immutable method, returns new arena
    setCell(x, y, type) {
        let arena = this.clone(true, false);
        arena.table[y] = this.field[y].slice(0,x) + type + this.field[y].slice(x+1)
        return arena
    }
    cell(pos) {
        if(!pos) return undefined;
        return this.cellXY(pos.x, pos.y);
    }
    cellXY(x, y) {
        if(x<0 || x>=this.width || y<0 || y>=this.height)
            return undefined;
        return new CellProxy(x, y, this.field[y][x]);
    }
    cellsAroundXY(x, y) {
        return [this.cellXY(x-1,y), this.cellXY(x+1,y), this.cellXY(x,y-1), this.cellXY(x,y+1)]
            .filter(c => c ? true : false)
    }
    clone(cloneTable = true) {
        let bf = Object.create(this);
        bf.table = cloneTable ? this.field.slice() : this.field;
        bf.width = this.width;
        bf.height = this.height;
        return bf;
    }
    toString() { 
        return this.field.join('\n')
    }
}

class CellProxy {
    constructor(x,y,type) {
        Object.assign(this,{x,y,type})
    }
    at(pos) {
        return this.x == pos.x && this.y == pos.y
    }
    get key() {
        return this.y<<MAXWIDTHSHIFT|this.x
    }
}

export {Arena, CellProxy}
export default Arena