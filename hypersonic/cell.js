import {countBoxesAround} from './celltools'

const CELL_NEARTOEXPLODE = 6666;
const CELL_DANGER = 666;
const CELL_BOMBNEARTOEXPLODE = 88;
const CELL_BOMB = 66;
const CELL_WALL = 10;
const CELL_BOX_BONUS = 4;
const CELL_BOX_TBD = 2; //box to be destroyed
const CELL_BOX = 1;
const CELL_EMPTY = 0;
const CELL_OTHER = -1;
const CELL_BONUS_BOMB = -3;
const CELL_BONUS_RADIUS = -4;
const ISEXPLOSIBLE = (type) => (type && Math.abs(type)<100);
const ISBOX = (type) => (type == CELL_BOX || type == CELL_BOX_BONUS);
const ISSOLID = (type) => (type > 0 && type < 100);
const ISTRAV = (type) => !ISSOLID(type);
const ISDANGER = (type) => (type == CELL_DANGER || type == CELL_BOMB);
const ISNEARTOEXPLODE = (type) => (type == CELL_NEARTOEXPLODE || type == CELL_BOMBNEARTOEXPLODE);
const ISBONUS = (type) => (type < -2);
const ISEMPTY = (type) => (type == CELL_EMPTY);
const ISBOMB = (type) => (type == CELL_BOMB || type == CELL_BOMBNEARTOEXPLODE);
const ISBONUSBOMB = (type) => (type == CELL_BONUS_BOMB);

class Cell {
    constructor(x, y, type, key) {
        this.x = x
        this.y = y
        this.type = type
        this.benefit = false
        this.timeleft = 999
        this.key = key
    }
    similar(cell) {
        return this.at(cell)
    }
    at(cell) {
        return this.x == cell.x && this.y == cell.y
    }
    setEmpty() {
        this.type = CELL_EMPTY
    }
    isExplosible() {
        return ISEXPLOSIBLE(this.type)
    }
    isTraversable() {
        return ISTRAV(this.type)
    }
    isBox() {
        return ISBOX(this.type)
    }
    isEmpty() {
        return ISEMPTY(this.type)
    }
    isDanger() {
        return ISDANGER(this.type) || ISNEARTOEXPLODE(this.type)
    }
    isSuperDanger() {
        return ISNEARTOEXPLODE(this.type)
    }
    isBonus() {
        return ISBONUS(this.type)
    }
    isBonusBomb() {
        return ISBONUSBOMB(this.type)
    }
    isEnemy() {
        return this.enemy
    }
    isBomb() {
        return ISBOMB(this.type)
    }
    distance(other) {
        return (Math.abs(this.x - other.x) + Math.abs(this.y - other.y))
    }
    isSaferThan(cell) {
        return this.timeleft > cell.timeleft
    }
    set bomb(bomb) {
        this._bomb = bomb
        this.timeleft = bomb.timeleft
    }
    get bomb() {
        return this._bomb
    }
    // Makes duplicate of a cell
    // PLEASE NOTE, it does not replace cell on battleField. To make a copy on BattleField use BattleField.cloneCell
    clone() {
        return Object.assign(Object.create(this), this)
    }
}


export {CELL_DANGER, CELL_BOMB, CELL_WALL, CELL_BOX_BONUS, CELL_BOX_TBD, CELL_BOX, CELL_EMPTY, CELL_OTHER, CELL_BONUS_BOMB, CELL_BONUS_RADIUS, CELL_NEARTOEXPLODE, CELL_BOMBNEARTOEXPLODE, Cell}
export default Cell
