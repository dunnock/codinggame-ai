require("babel-polyfill");

var db          = require('mongodb-promises').db('localhost:27017', 'coders-stats'), // host can be array in case of replSet
    testColl    = db.collection('test');

testColl.insert([{text: 'first task to do '}, {text: 'second task to do'}])
        .then(function (resultArr) {
            console.log('saved successfully');
        })
        .catch(function (err) {
            console.error('Error on insert ', err);
        });
