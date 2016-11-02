//var printapi = require("./printapi");
var config = require("./config");
var animation = require("./track"); 

config.logger = printErr;

animation.interface(readline, print, printErr);

animation.init(2, 2);


while(true) {
	animation.turn();	
}