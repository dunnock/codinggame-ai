import config from './config'

const _TRACE = 1;
const _DEBUG = 2;

function traceJSON(desc, json, level = _DEBUG) {
	if(config.log_level >= level) {
		let str = desc + ": " + 
			JSON.stringify(json, function( key, value) {
	    			if( key == 'parent' || key == 'children') { return "#REF";}
	    			else {return value;}
	  			}
	  		);
		if(config.logger)
			config.logger(str)
		else
			console.log(str)

	  	}
}

export {_TRACE, _DEBUG, traceJSON}