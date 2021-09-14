const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const webpackConfig = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.js(x)?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: {
                    loader: "html-loader"
                }
            },
            {
                test: /\.(s?css|sass)$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    "css-loader",
                    "sass-loader",
                ]
            },
            {
                test: /\.(png|gif|jp(e)?g)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "assets/[hash].[ext]"
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        // This is necessary to change routes when running serve in development mode
        historyApiFallback: true
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "assets/[name].css"
        })
    ]
};

module.exports = webpackConfig;
