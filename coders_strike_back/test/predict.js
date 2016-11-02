require("babel-polyfill");

var printapi = require("../printapi");
var data = require("../data");
var predict = require("../predictor")
var animation = require("../track"); 

animation.interface(data.readline, printapi.print, printapi.printErr);
data.init();
animation.init();
animation.initPods();

let prediction = predict.predictOptions({pod: animation.getPods()[0], depth: 50});

console.log(`result: ${prediction.success}`);

prediction.result.node.path().forEach(node => console.log(`${JSON.stringify(node.action)}  ==>>  ${JSON.stringify(node.state)}`));

/*
console.log(JSON.stringify(prediction.result.node.path(),
    function( key, value) {
        if( key == 'parent') return "#ref"
        else if( key == 'children') return "#array"
        else return value
    },
    ' '
  ));
  */