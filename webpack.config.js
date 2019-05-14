const webpack = require('webpack');
const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const modeConfig = env => require(`./build-utils/webpack.${env.mode}.js`)(env);
const loadPresets = require('./build-utils/loadPresets');

const webcomponentsjs = './node_modules/@webcomponents/webcomponentsjs';

const pathPrefix = '/';
// const pathPrefix = '/pwa-play/';

const polyfills = [
    {from: resolve(`${webcomponentsjs}/webcomponents-*.{js,map}`), to: 'vendor', flatten: true},
    {from: resolve(`${webcomponentsjs}/bundles/*.{js,map}`), to: 'vendor/bundles', flatten: true},
    {from: resolve(`${webcomponentsjs}/custom-elements-es5-adapter.js`), to: 'vendor', flatten: true}
];

const assets = [
    {from: 'src/img', to: 'img/'},
    {from: 'src/styles.css', to: 'styles.css'},
    {from: 'src/manifest.webmanifest', to: 'manifest.webmanifest'}

];

const plugins = [
    new CleanWebpackPlugin(['dist']),
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
        minify: {
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true
        }
    }),
    new CopyWebpackPlugin([...polyfills, ...assets], {
        ignore: ['.DS_Store']
    })
];

module.exports = ({mode, presets}) => {
    return webpackMerge(
        {
            mode,
            output: {
                filename: '[name].[chunkhash:8].js',
                publicPath: pathPrefix
            },
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        exclude: /node_modules/,
                        use: 'ts-loader'
                    }
                ]
            },
            resolve: {
                extensions: ['.tsx', '.ts', '.js']
            },
            plugins
        },
        modeConfig({mode, presets}),
        loadPresets({mode, presets})
    );
};
