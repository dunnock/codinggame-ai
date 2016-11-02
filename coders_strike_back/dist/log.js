'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.traceJSON = exports._DEBUG = exports._TRACE = undefined;

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _TRACE = 1;
var _DEBUG = 2;

function traceJSON(desc, json) {
	var level = arguments.length <= 2 || arguments[2] === undefined ? _DEBUG : arguments[2];

	if (_config2.default.log_level >= level) {
		var str = desc + ": " + JSON.stringify(json, function (key, value) {
			if (key == 'parent' || key == 'children') {
				return "#REF";
			} else {
				return value;
			}
		});
		if (_config2.default.logger) _config2.default.logger(str);else console.log(str);
	}
}

exports._TRACE = _TRACE;
exports._DEBUG = _DEBUG;
exports.traceJSON = traceJSON;