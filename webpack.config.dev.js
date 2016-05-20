const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        main: [
            'webpack-hot-middleware/client',
            './example.js'
        ]
    },
    output: {
        path: __dirname,
        filename: 'example.bundle.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            { test: /\.js/, loader: 'babel', exclude: /node_modules/ }
        ]
    }
};
