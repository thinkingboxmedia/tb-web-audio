const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        main: [
            'webpack-hot-middleware/client',
            './example/example.js'
        ]
    },
    output: {
        path: path.join(__dirname, 'example'),
        filename: 'example.bundle.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            { test: /\.js/, loader: 'babel', query: { presets: [ 'es2015' ] }, exclude: /node_modules/ }
        ]
    }
};
