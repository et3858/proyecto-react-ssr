const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssWebpackPlugin = require("purgecss-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

/**
 * Checks if 'mode' for building the app is "development"
 * @param  {object} mode [Only takes the 'mode' field]
 * @return {bool}
 */
const isDev = ({ mode }) => mode === "development";

module.exports = (env, argv) => ({
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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin({
            filename: isDev(argv) ? "assets/[name].css" : "assets/[name]-[fullhash].css"
        }),
        new PurgecssWebpackPlugin({
            paths: glob.sync(`${path.join(__dirname, "src")}/**/*`, { nodir: true }),
        }),
    ]
});
