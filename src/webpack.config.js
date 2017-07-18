var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, "js/app/index.js"),
    output: {
        path: path.join(__dirname, "../public/javascripts"),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]
            }
        ]
    },
    resolve: {
        alias: {
            jquery: path.join(__dirname, "js/libs/jquery-3.2.1.js"),
            mod : path.join(__dirname, "js/mod"),
            less: path.join(__dirname, "less")
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery"
        })
    ]
}