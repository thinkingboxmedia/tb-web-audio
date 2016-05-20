const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config');
const openurl = require('openurl');
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: true,
	publicPath: config.output.publicPath,
	stats: {
		assets: false,
		colors: true,
		version: false,
		hash: false,
		timings: false,
		chunks: false,
		chunkModules: false
	}
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(path.join(__dirname, '../example')));

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, '../example/index.html'));
});

app.listen(3000, '0.0.0.0', function(err) {
	if (err) {
		console.log(err);
		return;
	}
	console.log('Listening at http://localhost:3000');
	openurl.open('http://localhost:3000');
});