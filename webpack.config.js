var path = require('path');

module.exports = {
	entry: './src/js/main.js',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'build.js',
		library: 'postcss-window-bundle',
		libraryTarget: 'umd'
	},
	devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel'
			},
			{
				test: /\.json$/,
				loader: 'json'
			}
		]
	},
	node: {
		fs: 'empty'
	}
};
