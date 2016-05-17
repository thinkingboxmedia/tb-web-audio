const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './index.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compressor: { warnings: false }
        })
    ],
    module: {
        loaders: [
            { test: /\.js/, loader: 'babel', exclude: /node_modules/ }
        ]
    }
};
