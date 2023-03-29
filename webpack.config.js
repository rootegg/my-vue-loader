const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const MyVueLoaderPlugin = require('./vue-loader/plugin.js')
const webpack = require('webpack')
const path = require('path')

/**
 * @type {webpack.Configuration}
 */
module.exports = {
    mode: "production",
    output: {
        clean: true
    },
    module: {
        rules: [
            {
                test: /.js$/,
                use: ['babel-loader']
            },
            {
                test: /.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /.vue$/,
                // use: ['vue-loader']
                loader: path.resolve(__dirname, './vue-loader/index.js')
            }
        ]
    },
    plugins: [
        // new VueLoaderPlugin(),
        new MyVueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html'
        })
    ]
}