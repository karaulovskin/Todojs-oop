'use strict';

// Require local webpack
var webpack = require('webpack');

const config = {
    context: __dirname + "/app",
    entry: './app.js',
    stats: { children: false },

    // Watcher
    watch: process.env.webpackWatch === 'true',
    watchOptions: {
        aggregateTimeout: 70
    },

    // Resolve params
    resolve: {
        modules: [
            __dirname,
            __dirname + '/node_modules'
        ],
        extensions: ['.js', '.css']
    },

    // Output params
    output: {
        path: __dirname + '/assets/js',
        // publicPath: '/assets/',
        filename: '[name].js',
    },

    // Loaders params
    module: {
        loaders: [
            {
                test: /jquery\.js$/,
                loader: 'expose-loader?$!expose-loader?jQuery'
            }, {
                test: /\.js$/,
                exclude: /(node_modules|vendor)/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: [
                        require.resolve('babel-preset-es2015'),
                        require.resolve('babel-preset-stage-0')
                    ]
                }
            }
        ]
    }
};

if (process.env.NODE_ENV == 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                // don't show unreachable variables etc
                warnings:     false,
                drop_console: true,
                unsafe:       true
            }
        })
    );
}

module.exports = config;