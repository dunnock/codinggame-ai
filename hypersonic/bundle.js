/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _predictor = __webpack_require__(1);

	var _config = __webpack_require__(3);

	var _config2 = _interopRequireDefault(_config);

	var _log = __webpack_require__(2);

	var _interfacetools = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_config2.default.logger = printErr; /**
	                                     * Auto-generated code below aims at helping you parse
	                                     * the standard input according to the problem statement.
	                                     **/

	const ARRAY = n => new Array(n);

	function countNodes(root) {
	    return 1 + root.children.reduce((count, node) => count + countNodes(node), 0);
	}

	var inputs = readline().split(' ');
	var width = parseInt(inputs[0]);
	var height = parseInt(inputs[1]);
	var myid = parseInt(inputs[2]);

	let bombRadius = 3;
	let bombsLeft = 1;

	function extractOptimalRoute(node) {
	    let route = [];
	    while (node = node.optimalSuccessor) route.push(node);
	    return route;
	}

	let prevTarget, player;

	// game loop
	while (true) {
	    let target;

	    let benchmark = Date.now();

	    // READ INPUT
	    let textField = ARRAY(height).fill('').map(readline);
	    let field = (0, _interfacetools.InitBattleField)(textField);
	    var entities = parseInt(readline());
	    for (var i = 0; i < entities; i++) {
	        var inputs = readline().split(' ');
	        (0, _interfacetools.InitBattleFieldObject)({
	            field,
	            entityType: parseInt(inputs[0]),
	            owner: parseInt(inputs[1]),
	            x: parseInt(inputs[2]),
	            y: parseInt(inputs[3]),
	            param1: parseInt(inputs[4]),
	            param2: parseInt(inputs[5]),
	            myid
	        });
	    }
	    (0, _interfacetools.DeployBombs)(field);

	    player = field.player;

	    let route = prevTarget ? prevTarget.route : undefined;
	    printErr(route ? route.map(node => {
	        let cur = node.state.player;
	        return `${ cur.x }:${ cur.y }(${ field.cell(cur).type }=${ prevTarget.root.state.cell(cur).type }) `;
	    }).join(' ') : "ERR");

	    // Validate and reset previous targets if not valid anymore
	    if (prevTarget && route && !player.at(prevTarget.player) && route.every(node => {
	        let cur = node.state.player;
	        let cell = field.cell(cur);
	        return cell.type == prevTarget.root.state.cell(cur).type && !cell.isEnemy();
	    })) {
	        target = prevTarget;
	        (0, _log.traceJSON)(`prevTarget: `, prevTarget.player, _log._TRACE);
	    } else {
	        let res, node;
	        res = (0, _predictor.predictOptions)({ field, depth: 7 });
	        if (res.success) node = res.result.node;else node = res.result.root;
	        target = node.state;
	        target.route = route = extractRoute(res.result.root);
	        target.root = res.result.root;
	        prevTarget = target;

	        (0, _log.traceJSON)(`player: `, player, _log._TRACE);
	        (0, _log.traceJSON)(`target cost ${ node.cost } benefit ${ node.benefit } score ${ node.score }: `, target.cell(target.player), _log._TRACE);
	    }

	    let action = "MOVE";
	    if (route && route.length > 0) {
	        route.forEach(n => (0, _log.traceJSON)(`node action ${ n.action.name } depth ${ n.depth } benefit ${ n.benefit }: `, n.state.cell(n.state.player), _log._TRACE));
	        let node = target.route.shift();
	        if (node.action.name == "Bomb") {
	            action = "BOMB";
	            if (route.length > 0) node = route.shift();
	        }
	        target = node.state;
	    }
	    print(`${ action } ${ target.player.x } ${ target.player.y } ${ Date.now() - benchmark }ms ${ countNodes(prevTarget.root) }`);
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _log = __webpack_require__(2);

	var _treesearch = __webpack_require__(10);

	var _celltools = __webpack_require__(6);

	//import { findOptimalSolutionIBFS, InformedActionsTreeExpander, ConfigurableFunction } from "./informedsearch"

	module.exports.predictOptions = predictOptions;

	function predictOptions({ field, depth = 6 }) {
		(0, _log.traceJSON)("predictOptions ", arguments);
		let treeExpander = new GameActions(field);
		field.cell(field.player).visited = true;
		let res = (0, _treesearch.startTreeDeepSearch)(field, {
			treeExpander,
			evalStateUtility,
			evalTerminalUtility,
			depthLimit: depth
		});
		return res;
	}

	function evalStateUtility(node) {
		let field = node.state;
		let benefit = field.benefit(field.cell(field.player));
		if (node.action.name == "Bomb") return benefit.bomb;else if (node.action.name != "Wait") return benefit.move;else return 0;
	}

	function evalTerminalUtility(node) {
		let field = node.state;
		let benefit = field.benefit(field.cell(field.player));
		let cellsAround = field.cellsAroundPlayer();
		if (cellsAround.every(c => !c.isTraversable())) return -100;else if (benefit.move < 0) return -60;else return Math.round(benefit.bomb / 3) + field.player.bombsLeft * 5;
	}

	// On every state (pod position) search will try following actions, 
	// branching search until it reaches target
	class GameActions extends _treesearch.FunctionalActionsTreeExpander {
		constructor(field) {
			super([node => node.state.playerCell().isDanger() ? node.state.cellsAroundPlayer().filter(cell => Escape.IsApplicable(node.state, cell)).map(cell => new Escape(node.state, cell)) : node.state.cellsAroundPlayer().filter(cell => Move.IsApplicable(node.state, cell)).map(cell => new Move(node.state, cell)), node => Bomb.IsApplicable(node.state) ? [new Bomb(node.state)] : [], node => Wait.IsApplicable(node.state) ? [new Wait(node.state)] : []]);
		}
	}

	// Deploy bomb, does not consume turn
	class Bomb extends _treesearch.SmartAction {
		constructor(field) {
			super({ field });
			this.name = "Bomb";
			this.cost = 0;
			this.player = field.player;
			this.cell = field.playerCell();
			this.key = "b" + this.cell.key + field.key;
		}
		apply(node) {
			return this.field.deployPlayerBomb(true);
		}
		isApplicable(node) {
			return Bomb.IsApplicable(node.state);
		}
		static IsApplicable(field) {
			let cell = field.playerCell();
			return !cell.isSuperDanger() && field.player.bombsLeft && field.benefit(cell).bomb > 0 && cell.isTraversable();
		}
	}

	// Wait in the cell, is a terminal state
	//  -  |  -  |  +
	// .X. | .X. | .X.
	// X!. | X.. | !.!
	// .!. | .!. | .!.
	class Wait extends _treesearch.SmartAction {
		constructor(field) {
			super({ field });
			this.name = "Wait";
			this.cost = 0;
			this.terminal = true;
		}
		apply(node) {
			return this.field;
		}
		isApplicable(node) {
			return Wait.IsApplicable(node.state);
		}
		static IsApplicable(field) {
			//when cell is not in danger and all cells around either not traversable or danger
			return !field.playerCell().isDanger() && !field.cellsAroundPlayer().some(cell => cell.isTraversable() && !cell.isDanger());
		}
	}

	// Moving by one turn in the specified direction (neighbour of the cell in the field)
	class Move extends _treesearch.SmartAction {
		constructor(field, cell) {
			super({ cell });
			this.name = "Move";
			this.cost = 1;
			this.key = "m" + cell.key + field.key;
		}
		apply(node) {
			let field = node.state;
			field = field.movePlayer(this.cell);
			field.playerCell().visited = true;
			return field;
		}
		isApplicable(node) {
			return Move.IsApplicable(node.state, this.cell);
		}
		static IsApplicable(field, cell) {
			return !cell.isDanger() && !cell.visited && cell.isTraversable();
		}
	}

	// Escape from the field with Bomb
	class Escape extends _treesearch.SmartAction {
		constructor(field, cell) {
			super({ cell });
			this.name = "Escape";
			this.cost = 1;
			this.key = "e" + cell.key + field.key;
		}
		apply(node) {
			let field = node.state;
			field = field.movePlayer(this.cell);
			field.playerCell().escapeVisited = true;
			return field;
		}
		isApplicable(node) {
			return Escape.IsApplicable(node.state, this.cell);
		}
		static IsApplicable(field, cellNew) {
			let cellOld = field.playerCell();
			return !cellNew.escapeVisited && cellNew.isTraversable() && !cellOld.isSaferThan(cellNew);
		}
	}

	exports.default = predictOptions;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.traceField = exports.trace = exports.traceJSON = exports._DEBUG = exports._TRACE = undefined;

	var _config = __webpack_require__(3);

	var _config2 = _interopRequireDefault(_config);

	var _interfacetools = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	const _TRACE = 1;
	const _DEBUG = 2;

	function traceJSON(desc, json, level = _DEBUG) {
		if (_config2.default.log_level < level) return;
		let str = desc + ": " + JSON.stringify(json, function (key, value) {
			if (key == 'parent' || key == 'children' || key == 'field' || key == 'route' || key == 'optimalSuccessor') {
				return "#REF";
			} else {
				return value;
			}
		});
		trace(str, level);
	}

	function trace(text, level = _DEBUG) {
		if (_config2.default.log_level < level) return;
		if (_config2.default.logger) _config2.default.logger(text);else console.log(text);
	}

	function traceField(field, level = _DEBUG) {
		trace(field.toStrings().map(s => "  " + s).join("\n"), level);
	}

	exports._TRACE = _TRACE;
	exports._DEBUG = _DEBUG;
	exports.traceJSON = traceJSON;
	exports.trace = trace;
	exports.traceField = traceField;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
		"log_level": 1
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.decodeType = exports.encodeType = exports.DeployBombs = exports.InitBattleField = exports.InitBattleFieldObject = undefined;

	var _cell = __webpack_require__(5);

	var _battlefield = __webpack_require__(7);

	var _battlefield2 = _interopRequireDefault(_battlefield);

	var _bomb = __webpack_require__(8);

	var _bomb2 = _interopRequireDefault(_bomb);

	var _celltools = __webpack_require__(6);

	var _log = __webpack_require__(2);

	var _sonic = __webpack_require__(9);

	var _sonic2 = _interopRequireDefault(_sonic);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function decodeType(charType) {
	    switch (charType) {
	        case '.':
	            return _cell.CELL_EMPTY;
	        case '0':
	            return _cell.CELL_BOX;
	        case 'X':
	            return _cell.CELL_WALL;
	        default:
	            return _cell.CELL_BOX_BONUS;
	    }
	    return _cell.CELL_OTHER;
	}

	function encodeType(cellType) {
	    switch (cellType) {
	        case _cell.CELL_EMPTY:
	            return '.';
	        case _cell.CELL_DANGER:
	            return '?';
	        case _cell.CELL_BOMBNEARTOEXPLODE:
	            return '@';
	        case _cell.CELL_NEARTOEXPLODE:
	            return '!';
	        case _cell.CELL_BOX:
	            return '0';
	        case _cell.CELL_BONUS_RADIUS:
	        case _cell.CELL_BONUS_BOMB:
	            return '$';
	        case _cell.CELL_BOX_BONUS:
	            return '1';
	        case _cell.CELL_BOX_TBD:
	            return '6';
	        case _cell.CELL_BOMB:
	            return '*';
	        case _cell.CELL_WALL:
	            return 'X';
	        default:
	            return 'O';
	    }
	}

	// returns battlefield created from the text representation according to types
	function InitBattleField(textField) {
	    let field = new _battlefield2.default(textField[0].length, textField.length);
	    textField.forEach((row, y) => row.split('').forEach((type, x) => field.initCell(x, y, decodeType(type))));
	    return field;
	}

	//This function mutates field and cells
	function InitBattleFieldObject({ field, entityType, owner, x, y, param1, param2, myid }) {
	    let cell = field.cellXY(x, y);
	    if (entityType == 0) {
	        let sonic = new _sonic2.default(cell, param1, param2);
	        if (owner == myid) field.player = sonic;else {
	            field.enemies.push(sonic);
	            cell.enemy = true;
	        }
	    } else if (entityType == 1) field.bombs.push(new _bomb2.default(cell, param2, param1));else if (entityType == 2) if (!cell.isDanger()) cell.type = param1 == 1 ? _cell.CELL_BONUS_RADIUS : _cell.CELL_BONUS_BOMB;
	}

	function DeployBombs(field) {
	    field.bombs.sort((b1, b2) => b1.timeleft - b2.timeleft).forEach(bomb => (0, _celltools.deployBomb)(bomb, field));
	}

	exports.InitBattleFieldObject = InitBattleFieldObject;
	exports.InitBattleField = InitBattleField;
	exports.DeployBombs = DeployBombs;
	exports.encodeType = encodeType;
	exports.decodeType = decodeType;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Cell = exports.CELL_BOMBNEARTOEXPLODE = exports.CELL_NEARTOEXPLODE = exports.CELL_BONUS_RADIUS = exports.CELL_BONUS_BOMB = exports.CELL_OTHER = exports.CELL_EMPTY = exports.CELL_BOX = exports.CELL_BOX_TBD = exports.CELL_BOX_BONUS = exports.CELL_WALL = exports.CELL_BOMB = exports.CELL_DANGER = undefined;

	var _celltools = __webpack_require__(6);

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
	const ISEXPLOSIBLE = type => type && Math.abs(type) < 100;
	const ISBOX = type => type == CELL_BOX || type == CELL_BOX_BONUS;
	const ISSOLID = type => type > 0 && type < 100;
	const ISTRAV = type => !ISSOLID(type);
	const ISDANGER = type => type == CELL_DANGER || type == CELL_BOMB;
	const ISNEARTOEXPLODE = type => type == CELL_NEARTOEXPLODE || type == CELL_BOMBNEARTOEXPLODE;
	const ISBONUS = type => type < -2;
	const ISEMPTY = type => type == CELL_EMPTY;
	const ISBOMB = type => type == CELL_BOMB || type == CELL_BOMBNEARTOEXPLODE;
	const ISBONUSBOMB = type => type == CELL_BONUS_BOMB;

	class Cell {
	    constructor(x, y, type, key) {
	        this.x = x;
	        this.y = y;
	        this.type = type;
	        this.benefit = false;
	        this.timeleft = 999;
	        this.key = key;
	    }
	    similar(cell) {
	        return this.at(cell);
	    }
	    at(cell) {
	        return this.x == cell.x && this.y == cell.y;
	    }
	    setEmpty() {
	        this.type = CELL_EMPTY;
	    }
	    isExplosible() {
	        return ISEXPLOSIBLE(this.type);
	    }
	    isTraversable() {
	        return ISTRAV(this.type);
	    }
	    isBox() {
	        return ISBOX(this.type);
	    }
	    isEmpty() {
	        return ISEMPTY(this.type);
	    }
	    isDanger() {
	        return ISDANGER(this.type) || ISNEARTOEXPLODE(this.type);
	    }
	    isSuperDanger() {
	        return ISNEARTOEXPLODE(this.type);
	    }
	    isBonus() {
	        return ISBONUS(this.type);
	    }
	    isBonusBomb() {
	        return ISBONUSBOMB(this.type);
	    }
	    isEnemy() {
	        return this.enemy;
	    }
	    isBomb() {
	        return ISBOMB(this.type);
	    }
	    distance(other) {
	        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
	    }
	    isSaferThan(cell) {
	        return this.timeleft > cell.timeleft;
	    }
	    set bomb(bomb) {
	        this._bomb = bomb;
	        this.timeleft = bomb.timeleft;
	    }
	    get bomb() {
	        return this._bomb;
	    }
	    // Makes duplicate of a cell
	    // PLEASE NOTE, it does not replace cell on battleField. To make a copy on BattleField use BattleField.cloneCell
	    clone() {
	        return Object.assign(Object.create(this), this);
	    }
	}

	exports.CELL_DANGER = CELL_DANGER;
	exports.CELL_BOMB = CELL_BOMB;
	exports.CELL_WALL = CELL_WALL;
	exports.CELL_BOX_BONUS = CELL_BOX_BONUS;
	exports.CELL_BOX_TBD = CELL_BOX_TBD;
	exports.CELL_BOX = CELL_BOX;
	exports.CELL_EMPTY = CELL_EMPTY;
	exports.CELL_OTHER = CELL_OTHER;
	exports.CELL_BONUS_BOMB = CELL_BONUS_BOMB;
	exports.CELL_BONUS_RADIUS = CELL_BONUS_RADIUS;
	exports.CELL_NEARTOEXPLODE = CELL_NEARTOEXPLODE;
	exports.CELL_BOMBNEARTOEXPLODE = CELL_BOMBNEARTOEXPLODE;
	exports.Cell = Cell;
	exports.default = Cell;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.deployBomb = exports.countTargetsAround = exports.iterateCellsAround = undefined;

	var _cell = __webpack_require__(5);

	function iterateCellsAround(cell, field, depth = 3, callback) {
	    [-1, 1, -field.width, field.width].forEach(shift => {
	        let key = cell.key + shift;
	        for (let i = 1; i < depth; i++, key += shift) {
	            let nc = field.cellByKey(key);
	            if (nc) {
	                if (nc.isExplosible()) i = depth + 1;
	                callback(nc);
	            } else i = depth + 1;
	        }
	    });
	}

	function countTargetsAround(cell, field, depth = 3) {
	    let boxes = 0,
	        enemies = cell.isEnemy() ? 1 : 0;
	    iterateCellsAround(cell, field, depth, c => {
	        if (c.isBox()) boxes++;
	        if (c.isEnemy()) enemies++;
	    });
	    return { boxes, enemies };
	}

	//This function mutates field and cells, unless clonecells param is set
	function deployBomb(bomb, field, clonecells = false) {
	    let cell = clonecells ? field.cloneCell(bomb.x, bomb.y) : field.cellXY(bomb.x, bomb.y);
	    if (cell.timeleft < bomb.timeleft) bomb.timeleft = cell.timeleft;
	    let [danger, benefit] = bomb.isSuperDanger() ? [_cell.CELL_NEARTOEXPLODE, -10] : [_cell.CELL_DANGER, -3];
	    if (cell.benefit !== false) cell.benefit = Object.assign({}, cell.benefit, { move: cell.benefit.move + benefit });
	    cell.type = danger == _cell.CELL_NEARTOEXPLODE ? _cell.CELL_BOMBNEARTOEXPLODE : _cell.CELL_BOMB;
	    cell.bomb = bomb;

	    iterateCellsAround(cell, field, bomb.radius, c => {
	        if (clonecells) c = field.cloneCell(c.x, c.y);
	        if (c.benefit !== false) c.benefit = Object.assign({}, c.benefit, { move: c.benefit.move + benefit });
	        c.timeleft = bomb.timeleft;
	        if (c.isTraversable() && !c.isSuperDanger()) c.type = danger;
	        if (c.isBox()) c.type = _cell.CELL_BOX_TBD;
	    });
	}

	exports.iterateCellsAround = iterateCellsAround;
	exports.countTargetsAround = countTargetsAround;
	exports.deployBomb = deployBomb;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _cell = __webpack_require__(5);

	var _cell2 = _interopRequireDefault(_cell);

	var _bomb = __webpack_require__(8);

	var _bomb2 = _interopRequireDefault(_bomb);

	var _celltools = __webpack_require__(6);

	var _interfacetools = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	class BattleField {
	    constructor(width, height) {
	        this.length = width * height;
	        this.table = new Array(this.length);
	        this.enemies = new Array();
	        this.bombs = new Array();
	        this.player = undefined;
	        this.width = width;
	        this.height = height;
	        this.boxes = 0;
	        this.key = "";
	        this.time = 0;
	    }
	    initCell(x, y, type) {
	        let key = x + y * this.width;
	        let cell = this.table[key] = new _cell2.default(x, y, type, key);
	        if (cell.isBox()) this.boxes++;
	    }
	    cell(pos) {
	        if (!pos) return undefined;
	        return this.cellXY(pos.x, pos.y);
	    }
	    cellXY(x, y) {
	        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return undefined;
	        return this.table[x + y * this.width];
	    }
	    cellByKey(key) {
	        if (key < 0 || key > this.length) return undefined;
	        return this.table[key];
	    }
	    cloneCell(x, y) {
	        let cell = this.cellXY(x, y);
	        if (!cell) return undefined;
	        return this.table[cell.key] = cell.clone();
	    }
	    benefit(cell) {
	        if (cell.benefit === false && this.player && cell.isTraversable()) {
	            let greedOnBombs = this.player.bombsLeft <= 1;
	            cell.benefit = { move: 0, bomb: 0 };
	            let { boxes, enemies } = (0, _celltools.countTargetsAround)(cell, this, this.player.bombsRadius);
	            let emul = greedOnBombs ? 2 : 8;
	            let bmul = greedOnBombs ? 6 : 10;
	            cell.benefit.bomb = boxes * bmul + enemies * emul;
	            //if target cell has only one exit it might be a trap
	            /*            cell.clearAround = this.cellsAroundXY(cell.x, cell.y).reduce((count, cell) => (count + (cell.isTraversable() ? 1 : 0)), 0)
	                        if(cell.clearAround <= 1)
	                            cell.benefit.move -= 10;*/
	            //            let timeleft = cell.timeleft // - this.time
	            //            if(cell.isDanger() && timeleft >= 0) { //not welcoming walking around dangerous area 
	            //                cell.benefit.move -= cell.isSuperDanger() ? (8 - timeleft) * 15 : (8 - timeleft) * 2
	            //            }
	            if (cell.isBonusBomb() && greedOnBombs) //welcoming walking to bonus bomb when have only 1
	                cell.benefit.move += 10;else if (cell.isBonus()) //bonus always welcome
	                cell.benefit.move += 3;
	            //            if(cell.isEnemy()) //please don't move to cell with enemy, who knows what's on his mind
	            //                cell.benefit.move -= 10;
	        }
	        return cell.benefit;
	    }
	    deployPlayerBomb() {
	        let field = this.clone(true, true);
	        let bomb = new _bomb2.default(field.player, field.player.bombsRadius);
	        (0, _celltools.deployBomb)(bomb, field, true);
	        field.player.bombsLeft -= 1;
	        field.key += "b" + field.playerCell().key;
	        return field;
	    }
	    // Immutable method, returns new BattleField with updated player position
	    movePlayer(cell) {
	        let field = this.clone(true, false);
	        this.benefit(cell); // intentionally calculate benefit before duplication, as benefit is just a cache, so can be reused
	        cell = field.cloneCell(cell.x, cell.y);
	        if (cell.isBonus()) cell.setEmpty();
	        field.player = this.player.move(cell);
	        field.time++;
	        return field;
	    }
	    cellsAroundXY(x, y) {
	        let key = x + y * this.width;
	        return [key - 1, key + 1, key - this.width, key + this.width].map(key => this.cellByKey(key)).filter(c => c ? true : false);
	    }
	    cellsAroundPlayer() {
	        return this.cellsAroundXY(this.player.x, this.player.y);
	    }
	    playerCell() {
	        return this.cell(this.player);
	    }
	    clone(cloneTable = true, clonePlayer = false) {
	        let bf = Object.create(this);
	        bf.table = cloneTable ? this.table.slice() : this.table;
	        bf.player = clonePlayer ? this.player.clone() : this.player;
	        bf.enemies = this.enemies; //.map(e => e.clone());
	        bf.bombs = this.bombs;
	        bf.width = this.width;
	        bf.height = this.height;
	        bf.key = this.key;
	        bf.time = this.time;
	        return bf;
	    }
	    toStrings() {
	        let rows = new Array();
	        for (let y = 0; y < this.height; y++) {
	            let row = "";
	            for (let x = 0; x < this.width; x++) {
	                let cell = this.cellXY(x, y);
	                row += (0, _interfacetools.encodeType)(cell.type);
	                if (this.enemies.some(e => e.at(cell))) row += 'E';else if (this.player.at(cell)) row += 'P';else row += ' ';
	            }
	            rows.push(row);
	        }
	        return rows;
	    }
	}

	exports.default = BattleField;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
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

	exports.default = Bomb;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	class Sonic {
		constructor(pos, bombsLeft, bombsRadius, bombRecover = 8) {
			this.x = pos.x;
			this.y = pos.y;
			this.bombsLeft = bombsLeft;
			this.bombsRadius = bombsRadius;
			this.bombRecover = bombRecover;
			if (bombRecover == 0) {
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

	exports.default = Sonic;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.BFS = exports.DFS = exports.FunctionalActionsTreeExpander = exports.ActionsTreeExpander = exports.SmartAction = exports.DecisionTreeNode = exports.Result = exports.startTreeDeepSearch = exports.treeMaxSearch = undefined;

	var _log = __webpack_require__(2);

	const SEARCH_CUTOFF = Symbol.for("findsolution.cutoff");
	const SCORE = (benefit, cost) => benefit * 4 - cost;

	// options is a structure of:
	//   {treeExpander, evalStateUtility, evalTerminalUtility, depthLimit = 10}

	function startTreeDeepSearch(initialState, options) {
		let node = new DecisionTreeNode(initialState, { cost: 0, depth: 0 });

		let optimal = treeDeepSearch(node, options).finalSuccessor();

		if (optimal) return new SuccessResult({ node: optimal, root: node });else return new FailureResult(SEARCH_CUTOFF, { root: node });
	}

	// Performs tree search going through nodes in the order defined by queue.
	// Nodes in the tree expanded using TreeExpander class instance
	//   initialState - starting point for the search
	//   treeGen class instance of TreeExpander
	//	 checkTarget function accepts node.state, should return true if search target achieved
	//	 use queue DFS for Depth First Search, BFS is used by default
	function treeDeepSearch(node, options) {
		if (node.score) // node from cache
			return node;

		let { treeExpander, evalStateUtility, evalTerminalUtility, depthLimit = 10 } = options;
		node.benefit = node.parent ? node.parent.benefit + evalStateUtility(node) : 0;
		let terminal = node.depth >= options.depthLimit;

		//// TODO: add condition to cancel search when score is too low
		let optimalSuccessor = !terminal ? treeExpander.expandNode(node).map(child => treeDeepSearch(child, options)).reduce((prev, cur) => prev && prev.score > cur.score ? prev : cur, false) : false;

		if (terminal || !optimalSuccessor) {
			node.benefit += evalTerminalUtility(node);
			node.score = SCORE(node.benefit, node.cost);
		} else {
			node.score = optimalSuccessor.score;
			node.optimalSuccessor = optimalSuccessor;
		}

		return node;
	}

	// Action interface, action applied to node generates successor node
	// Subclass must overload
	//   .isApplicable(DecisionTreeNode)
	//		returns true if action can be applied to the node.
	//		Please note, cutting off nodes from the search can decrease search complexity
	//		from O(b^d) to O(b*d) (e.g. increase performance), where b is average number
	// 		of branches from usual node and d is search depth
	//   .apply(DecisionTreeNode node)
	//		should return successor state of a node.state, which will be automatically
	//		wrapped into DecisionTreeNode
	//   .cost()
	//		cost of action later aggregated into path cost. By default cost of action is 1.
	// Please note, subclass constructor can call super(props) to initialize its
	// instance properties, in fact it just does following:
	//		Object.assign(this, params); 
	// Nevertheless action is a verb, its defined as class to let it contain its configuration
	class SmartAction {
		constructor(params) {
			Object.assign(this, params);
		}
		// apply action to decisionTreeNode.state, returns resulting state
		apply(decisionTreeNode) {
			throw new Error("SmartAction is abstract class, should not be instantiated");
		}
		isApplicable(decisionTreeNode) {
			throw new Error("SmartAction is abstract class, should not be instantiated");
		}
	}

	// TreeExpander interface, action applied to node generates successor node
	// Subclass must overload expandNode method, accepting treeNode instance of DecisionTreeNode, 
	// returning array of expanded nodes instances of DecisionTreeNode
	class TreeExpander {
		// treeNode
		expandNode(treeNode) {
			throw new Error("TreeExpander is abstract class, should not be instantiated");
		}
	}

	// Node leafs represent states, branch is action.
	// Action is transforming node into successor node.
	// New ActionsTreeExpander([new SmartAction1(), new SmartAction2()])

	/// NOT WORKING ANYMORE, child node should be created via constructor in the expander now
	class ActionsTreeExpander extends TreeExpander {
		constructor(actions) {
			super();
			this.actions = actions;
			throw "ActionsTreeExpander NOT WORKING ANYMORE, child node should be created via constructor in the expander now";
		}
		expandNode(node) {
			return this.runActions(node, this.actions);
		}
		runActions(node, actions) {
			return actions.map(action => ({ action, applicable: action.isApplicable(node) })).filter(r => r.applicable).map(r => ({ action: r.action, state: r.action.apply(node, r.applicable) })).map(r => node.addChild(r));
		}
	}

	let _cache = {};

	function executeCachedAction(node, action, result) {
		if (node.depth == 0) _cache = {};
		let key = action.key,
		    child;
		if (!key) child = new DecisionTreeNode(action.apply(node), { action });else if (!_cache[key]) _cache[key] = child = new DecisionTreeNode(action.apply(node), { action });else {
			let cachedParent = _cache[key].parent;
			let parentScore = SCORE(cachedParent.benefit, cachedParent.cost);
			let nodeScore = SCORE(node.benefit, node.cost);
			child = nodeScore > parentScore ? _cache[key] : undefined;
			if (child) {
				(0, _log.traceJSON)(`Cache ${ key } hit by ${ node.action.name }, cached depth ${ child.depth }: `, child.action, _log._TRACE);
				child.score += nodeScore - parentScore;
				child.reassigned = true; //FOR DEBUG PURPOSE ONLY
			}
		}
		if (child) {
			node.addChild(child);
			result.push(child);
		}
	}
	// Node leafs represent states, branch is action.
	// Action is transforming node into successor node.
	// New FunctionalActionsTreeExpander([F1 => [new SmartAction1(), new SmartAction2()]])
	// Functions should return array of actions to be executed on node
	class FunctionalActionsTreeExpander extends TreeExpander {
		constructor(functions) {
			super([]);
			this.functions = functions;
		}
		expandNode(node) {
			let result = [];
			let actions = this.functions.map(func => func(node)).forEach(arr => arr.forEach(action => executeCachedAction(node, action, result)));
			return result;
		}
	}

	// DecisionTree is a resulting tree structure with state and action stored
	class DecisionTreeNode {
		constructor(state, options) {
			this.state = state;
			Object.assign(this, options);
			this.children = new Array();
		}
		addChild(node) {
			this.children.push(node);
			node.parent = this;
			node.cost = this.cost + node.action.cost;
			node.depth = this.depth + 1;
			return node;
		}
		finalSuccessor() {
			//		traceJSON("finalSuccessor", this.action, _TRACE)
			if (this.optimalSuccessor) return this.optimalSuccessor.finalSuccessor();else return this;
		}
		*leaves() {
			if (this.children.length == 0) yield this;else for (let node of this.children) yield* node.leaves();
		}
		duplicate(queue) {
			for (let node of queue) if (node.state.similar(this.state)) return true;
			return false;
		}
	}

	// Search result types
	class Result {
		constructor({ success = true, result }) {
			this.success = success;
			this.result = result;
		}
	}

	// success result 
	class SuccessResult extends Result {
		constructor({ node, root }) {
			super({ result: { node, root } });
		}
	}

	class FailureResult extends Result {
		constructor(failure, { root }) {
			super({ success: false, result: { root } });
			this.failure = failure;
		}
	}

	// QUEUES: use for DFS or BFS search order
	class DFS extends Array {
		next() {
			return this.pop();
		}
	}

	class BFS extends Array {
		next() {
			return this.shift();
		}
	}

	// Performs tree search going through nodes in the order defined by queue.
	// Nodes in the tree expanded using TreeExpander class instance
	//   initialState - starting point for the search
	//   treeGen class instance of TreeExpander
	//	 checkTarget function accepts node.state, should return true if search target achieved
	//	 use queue DFS for Depth First Search, BFS is used by default
	/// !!!NOT WORKING ANYMORE DUE TO CHANGES IN DecisionTreeNode and SMARTACTIONS
	function treeMaxSearch({ initialState, treeExpander, evalStateUtility, evalTerminalUtility, queue, depthLimit = 0, nodesLimit = 600 }) {
		throw "treeMaxSearch: !!!NOT WORKING ANYMORE DUE TO CHANGES IN DecisionTreeNode and SMARTACTIONS";
		// Validate input params
		if (!(treeExpander instanceof TreeExpander)) throw new Error("treeGen parameter should be instanceof TreeExpander subclass");
		if (!queue.next || !queue.push) throw new Error("queue should have push and next functions defined");

		//Initialize either from the state or from queue
		var root;
		if (queue.length == 0) {
			root = new DecisionTreeNode(initialState);
			root.benefit = 0;
			queue.push(root);
		} else {
			// If queue is not empty we expectits initialized with root node
			root = queue[0];
		}

		let maxScore = -9999,
		    maxNode;
		let totalNodes = 0;

		// Go through all nodes in the order defined by queue.next,
		// expanding every node further to the queue using treeGen.expandNode
		while (queue.length > 0) {
			let node = queue.next(),
			    leaf;
			//		traceJSON("queue", queue);
			if (!(node instanceof DecisionTreeNode)) throw new Error(`Incorrect node was generated by treeExpander: ${ node }`);
			if (depthLimit > 0 && node.depth >= depthLimit || node.action && node.action.terminal /* || totalNodes > nodesLimit */) leaf = node;else {
				(0, _log.traceJSON)("Expanding node ", node);
				let expander = treeExpander.expandNode(node);
				if (expander.length) expander.forEach(node => {
					node.benefit = node.parent.benefit + evalStateUtility(node);
				});else leaf = node;
				totalNodes += expander.length;
				//if(queue.length > 10) expander = expander.filter(node => !node.duplicate(queue))
				queue.push(...expander);
				//			traceJSON("Expanded node with ", expander)
			}

			if (leaf) {
				leaf.benefit += evalTerminalUtility(leaf);
				leaf.score = leaf.cost || leaf.benefit < 0 ? SCORE(leaf.benefit, leaf.cost) : 0; //reset score when no move
				if (leaf.score > maxScore) {
					maxScore = leaf.score;
					maxNode = leaf;
				}
			}
		}

		if (maxNode) return new SuccessResult({ node: maxNode, root });else return new FailureResult(SEARCH_CUTOFF, { root });
	}

	exports.treeMaxSearch = treeMaxSearch;
	exports.startTreeDeepSearch = startTreeDeepSearch;
	exports.Result = Result;
	exports.DecisionTreeNode = DecisionTreeNode;
	exports.SmartAction = SmartAction;
	exports.ActionsTreeExpander = ActionsTreeExpander;
	exports.FunctionalActionsTreeExpander = FunctionalActionsTreeExpander;
	exports.DFS = DFS;
	exports.BFS = BFS;
	exports.default = treeMaxSearch;

/***/ }
/******/ ]);