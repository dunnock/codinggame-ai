import config from './config'
import {encodeType} from './interfacetools'

const _TRACE = 1;
const _DEBUG = 2;

function traceJSON(desc, json, level = _DEBUG) {
	if(config.log_level < level) return;
	let str = desc + ": " + 
		JSON.stringify(json, function( key, value) {
    			if( key == 'parent' || key == 'children' || key == 'field' || key == 'route' || key == 'optimalSuccessor') { return "#REF";}
    			else {return value;}
  			}
  		);
  	trace(str, level);
}

function trace(text, level = _DEBUG) {
	if(config.log_level < level) return;
	if(config.logger)
		config.logger(text)
	else
		console.log(text)
}

function traceField(field, level = _DEBUG) {
	trace(field.toStrings().map(s => "  " + s).join("\n"), level);
}

export {_TRACE, _DEBUG, traceJSON, trace, traceField}