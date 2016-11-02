import { CELL_EMPTY, CELL_BOX, CELL_WALL, CELL_BOX_BONUS, CELL_OTHER, CELL_BONUS_RADIUS, CELL_BONUS_BOMB, CELL_BOMB, CELL_BOX_TBD, CELL_DANGER, CELL_NEARTOEXPLODE, CELL_BOMBNEARTOEXPLODE, Cell } from './cell'
import BattleField from './battlefield'
import Bomb from './bomb'
import { iterateCellsAround, deployBomb } from './celltools'
import { traceJSON, _TRACE } from "./log"
import Sonic from "./sonic"

function decodeType(charType) {
    switch(charType) {
        case '.':
            return CELL_EMPTY;
        case '0':
            return CELL_BOX;
        case 'X':
            return CELL_WALL;
        default:
            return CELL_BOX_BONUS;
    }
    return CELL_OTHER;
}

function encodeType(cellType) {
    switch(cellType) {
        case CELL_EMPTY:
            return '.';
        case CELL_DANGER:
            return '?';
        case CELL_BOMBNEARTOEXPLODE:
            return '@';
        case CELL_NEARTOEXPLODE:
            return '!';
        case CELL_BOX:
            return '0';
        case CELL_BONUS_RADIUS:
        case CELL_BONUS_BOMB:
            return '$';
        case CELL_BOX_BONUS:
            return '1';
        case CELL_BOX_TBD:
            return '6';
        case CELL_BOMB:
            return '*';
        case CELL_WALL:
            return 'X';
        default:
            return 'O';
    }
}

// returns battlefield created from the text representation according to types
function InitBattleField(textField) {
    let field = new BattleField(textField[0].length, textField.length);
    textField.forEach((row, y) =>
        row.split('').forEach((type, x) => 
            field.initCell(x, y, decodeType(type))));
    return field;
}

//This function mutates field and cells
function InitBattleFieldObject({field, entityType, owner, x, y, param1, param2, myid}) {
    let cell = field.cellXY(x, y);
    if(entityType == 0) {
        let sonic = new Sonic(cell, param1, param2);
        if(owner == myid)
            field.player = sonic;
        else {
            field.enemies.push(sonic);
            cell.enemy = true;
        }
    } 
    else if(entityType == 1)
        field.bombs.push(new Bomb(cell, param2, param1))
    else if(entityType == 2)
        if(!cell.isDanger()) cell.type = param1 == 1 ? CELL_BONUS_RADIUS : CELL_BONUS_BOMB;
}

function DeployBombs(field) {
    field.bombs.sort((b1, b2) => (b1.timeleft - b2.timeleft)).forEach(bomb => deployBomb(bomb, field))
}

export {InitBattleFieldObject, InitBattleField, DeployBombs, encodeType, decodeType}
