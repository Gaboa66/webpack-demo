const path = require('path');
const parts = require('./webpack.parts');
const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build'),
};

const commonConfig = merge([

    {
        entry: {
            app: PATHS.app,
        },

        output: {
            path: PATHS.build,
            filename: '[name].js',
        },

        plugins: [
            new HtmlWebpackPlugin({
                title: 'Webpack Demo',
            }),
            new FriendlyErrorsWebpackPlugin({
                compilationSuccessInfo: {
                    messages: ['You application is running here http://localhost:8080'],
                },
            }),
        ],

    },

    parts.lintJavaScript({ include: PATHS.app }),

]);

const productionConfig = merge([
    {
        plugins: [
            new CaseSensitivePathsPlugin(),
        ],
    }
]);

const developmentConfig = merge([
    
    {
        plugins: [
            new webpack.LoaderOptionsPlugin({
                options: {
                    eslint: {
                        failOnWarning: false,
                        failOnError: true,

                        fix: true,
                    },
                },
            }),
        ],
    },

    parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT,
    }),

]);

module.exports = (env) => {
    if (env === 'production') {
        return merge(commonConfig, productionConfig);
    }

    return merge(commonConfig, developmentConfig);
};