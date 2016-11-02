import Cell from './cell'
import Bomb from './bomb'
import {countTargetsAround, deployBomb} from "./celltools"
import {encodeType} from "./interfacetools"

class BattleField {
    constructor(width, height) {
        this.length = width*height
        this.table = new Array(this.length)
        this.enemies = new Array()
        this.bombs = new Array()
        this.player = undefined
        this.width = width
        this.height = height
        this.boxes = 0
        this.key = ""
        this.time = 0
    }
    initCell(x, y, type) {
        let key = x + y*this.width
        let cell = this.table[key] = new Cell(x, y, type, key)
        if(cell.isBox()) this.boxes++
    }
    cell(pos) {
        if(!pos) return undefined;
        return this.cellXY(pos.x, pos.y);
    }
    cellXY(x, y) {
        if(x<0 || x>=this.width || y<0 || y>=this.height)
            return undefined;
        return this.table[x + y*this.width];
    }
    cellByKey(key) {
        if(key < 0 || key > this.length)
            return undefined;
        return this.table[key];
    }
    cloneCell(x, y) {
        let cell = this.cellXY(x, y);
        if(!cell)
            return undefined;
        return this.table[cell.key] = cell.clone();
    }
    benefit(cell) {
        if(cell.benefit === false && this.player && cell.isTraversable()) {
            let greedOnBombs = this.player.bombsLeft <= 1;
            cell.benefit = {move: 0, bomb: 0}
            let {boxes, enemies} = countTargetsAround(cell, this, this.player.bombsRadius)
            cell.benefit.bomb = boxes * 10 + enemies * 4
            //if target cell has only one exit it might be a trap
/*            cell.clearAround = this.cellsAroundXY(cell.x, cell.y).reduce((count, cell) => (count + (cell.isTraversable() ? 1 : 0)), 0)
            if(cell.clearAround <= 1)
                cell.benefit.move -= 10;*/
//            let timeleft = cell.timeleft // - this.time
//            if(cell.isDanger() && timeleft >= 0) { //not welcoming walking around dangerous area 
//                cell.benefit.move -= cell.isSuperDanger() ? (8 - timeleft) * 15 : (8 - timeleft) * 2
//            }
            if(cell.isBonusBomb() && greedOnBombs) //welcoming walking to bonus bomb when have only 1
                cell.benefit.move += 10;
            else if(cell.isBonus()) //bonus always welcome
                cell.benefit.move += 3;
//            if(cell.isEnemy()) //please don't move to cell with enemy, who knows what's on his mind
//                cell.benefit.move -= 10;
        }
        return cell.benefit
    }
    deployPlayerBomb() {
        let field = this.clone(true, true)
        let bomb = new Bomb(field.player, field.player.bombsRadius)
        deployBomb(bomb, field, true)
        field.player.bombsLeft -= 1
        field.key += "b" + field.playerCell().key
        return field;
    }
    // Immutable method, returns new BattleField with updated player position
    movePlayer(cell) {
        let field = this.clone(true, false);
        this.benefit(cell) // intentionally calculate benefit before duplication, as benefit is just a cache, so can be reused
        cell = field.cloneCell(cell.x, cell.y)
        if(cell.isBonus())
            cell.setEmpty()
        field.player = this.player.move(cell)
        field.time++
        cell.visited = true
        return field
    }
    cellsAroundXY(x, y) {
        let key = x + y*this.width
        let keys = [key-this.width, key+this.width]
        if(x>0) keys.push(key-1)
        if(x<this.width-1) keys.push(key+1)
        return keys.map(key => this.cellByKey(key)).filter(c => c ? true : false)
    }
    cellsAroundPlayer() {
        return this.cellsAroundXY(this.player.x, this.player.y)
    }
    playerCell() {
        return this.cell(this.player);
    }
    clone(cloneTable = true, clonePlayer = false) {
        let bf = Object.create(this);
        bf.table = cloneTable ? this.table.slice() : this.table;
        bf.player = clonePlayer ? this.player.clone() : this.player;  
        bf.enemies = this.enemies;  //.map(e => e.clone());
        bf.bombs = this.bombs;
        bf.width = this.width;
        bf.height = this.height;
        bf.key = this.key
        bf.time = this.time
        return bf;
    }
    toStrings() {
        let rows = new Array();
        for(let y = 0; y<this.height; y++) {
            let row = "";
            for(let x = 0; x<this.width; x++) {
                let cell = this.cellXY(x, y);
                row += encodeType(cell.type);
                if(this.enemies.some(e => e.at(cell)))
                    row += 'E'
                else if(this.player.at(cell))
                    row += 'P'
                else
                    row += ' ';
            }
            rows.push(row)
        }
        return rows;
    }
}

export default BattleField