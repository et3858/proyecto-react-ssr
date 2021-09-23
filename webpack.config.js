const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

require("dotenv").config();

const noop = () => {};
const isDev = (process.env.NODE_ENV === "development");
const entry = ["./src/client/index.js"];

if (isDev) {
    entry.push("webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true");
}

module.exports = {
    entry,
    mode: process.env.NODE_ENV,
    output: {
        path: path.resolve(__dirname, "src/server/public"),
        filename: isDev ? "assets/bundle.js" : "assets/bundle-[fullhash].js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    optimization: {
        minimize: !isDev,
        minimizer: [new TerserPlugin()],
        splitChunks: {
            chunks: "async",
            cacheGroups: {
                vendors: {
                    name: "vendors",
                    chunks: "all",
                    reuseExistingChunk: true,
                    priority: 1,
                    filename: isDev ? "assets/vendor.js" : "assets/vendor-[fullhash].js",
                    enforce: true,
                    test: /[\\/]node_modules[\\/]/,
                    // test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,

                    // test(module, chunks) {
                    //     const name = module.nameForCondition && module.nameForCondition();
                    //     return chunks.some(chunk => chunk.name !== "vendors" && /[\\/]node_modules[\\/]/.test(name))
                    // }
                }
            }
        }
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
                test: /\.(sa|sc|c)ss$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    "css-loader",
                    "sass-loader",
                    "postcss-loader",
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
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        isDev ? new webpack.HotModuleReplacementPlugin() : noop,
        isDev ? noop : new CompressionWebpackPlugin({
            test: /\.(css|js)$/,
            filename: "[base].gz",
        }),
        isDev ? noop : new WebpackManifestPlugin(),
        // new HtmlWebpackPlugin({
        //     template: "./public/index.html",
        //     filename: "./index.html"
        // }),
        new MiniCssExtractPlugin({
            filename: isDev ? "assets/[name].css" : "assets/[name]-[fullhash].css"
        }),
    ]
};
