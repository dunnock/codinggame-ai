module.exports = {
  	entry: './main.js',
  	output: {
    	filename: 'bundle.js'       
  	},
 	module: {
  		loaders: [
    		{ 
    			test: /\.js$/, 
    			exclude: /node_modules/, 
    			loader: "babel",
    			query: {
    				plugins:["transform-es2015-modules-commonjs"],
    				presets:[],
    				babelrc: false
    			}
    		}
  		]
	}
};