import { CELL_EMPTY, CELL_BOX, CELL_WALL, CELL_BOX_BONUS, CELL_OTHER, CELL_BOMB, CELL_BOX_TBD, CELL_PLAYER, CELL_ENEMY, CELL_NEARTOEXPLODE, CELL_BOMBNEARTOEXPLODE, CELL_DANGER, Cell } from './cell'

function iterateCellsAround(cell, field, depth = 3, callback) {
    let width = field.width
    let [xl, xr] = [cell.x - depth, width - cell.x - depth].map(val => val<0?val:0)
    let depths = [depth+xl, depth+xr,depth,depth];
    [-1, 1, -width, width].forEach((shift,i) => {
        let key = cell.key + shift
        for(let d = 1; d < depths[i]; d++, key += shift) {
            let nc = field.cellByKey(key);
            if(nc) {
                if(nc.isExplosible()) d = depth+1;
                callback(nc); 
            } else d = depth+1;
        }
    })
}

function countTargetsAround(cell, field, depth = 3) {
    let boxes = 0, enemies = cell.isEnemy() ? 1 : 0;
    iterateCellsAround(cell, field, depth, c => { 
            if(c.isBox()) boxes++;
            if(c.isEnemy()) enemies++;
        });
    return {boxes, enemies};
}

//This function mutates field and cells, unless clonecells param is set
function deployBomb(bomb, field, clonecells = false) {
    let cell = clonecells ? field.cloneCell(bomb.x, bomb.y) : field.cellXY(bomb.x, bomb.y)
    if(cell.timeleft < bomb.timeleft) bomb.timeleft = cell.timeleft
    let [danger, benefit] = bomb.isSuperDanger() ? [CELL_NEARTOEXPLODE, -10] : [CELL_DANGER, -3]
    if(cell.benefit !== false) cell.benefit = Object.assign({}, cell.benefit, {move: cell.benefit.move + benefit})
    cell.type = danger == CELL_NEARTOEXPLODE ? CELL_BOMBNEARTOEXPLODE : CELL_BOMB
    cell.bomb = bomb

    iterateCellsAround(cell, field, bomb.radius, c => {
        if(clonecells) c = field.cloneCell(c.x, c.y)
        if(c.benefit !== false) c.benefit = Object.assign({}, c.benefit, {move: c.benefit.move + benefit, bomb: 0})
        if(c.timeleft && c.timeleft > bomb.timeleft) c.timeleft = bomb.timeleft
        if(c.isTraversable() && !c.isSuperDanger()) c.type = danger
        if(c.isBox()) c.type = CELL_BOX_TBD; })
}

export {iterateCellsAround, countTargetsAround, deployBomb}