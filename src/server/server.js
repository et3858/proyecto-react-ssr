import express from "express";
import dotenv from "dotenv";
import webpack from "webpack";
import helmet from "helmet";
import React from "react";
import { renderToString } from "react-dom/server";
import { renderRoutes } from "react-router-config";
import { StaticRouter } from "react-router-dom";
import serverRoutes from "../client/routes/routes";

dotenv.config();

const { NODE_ENV, PORT } = process.env;
const app = express();

if (NODE_ENV === "development") {
    console.log("Development config");

    const webpackConfig = require("../../webpack.config");
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackHotMiddleware = require("webpack-hot-middleware");
    const compiler = webpack(webpackConfig);
    const serverConfig = {
        port: PORT,
        // hot: true
    };

    app.use(webpackDevMiddleware(compiler));
    app.use(webpackHotMiddleware(compiler));
} else {
    console.log("Production config");

    app.use((req, res, next) => {
        next();
    });

    app.use(express.static(`${__dirname}/public`));
    app.use(helmet());
    app.use(helmet.permittedCrossDomainPolicies());
    app.disable("x-powered-by");
}

const setResponse = (html) => {
    const mainStyles = "assets/main.css";
    const mainBuild = "assets/bundle.js";
    const vendorBuild = "assets/vendor.js";
    // <script src="${vendorBuild}" type="text/javascript"></script>

    return (`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="${mainStyles}" type="text/css">
            <title>Proyecto React con SSR</title>
        </head>
        <body>
            <div id="app">${html}</div>
            <script src="${mainBuild}" type="text/javascript"></script>
        </body>
        </html>
    `);
};

app.get("*", (req, res) => {
    const html = renderToString(
        <StaticRouter location={req.url} context={{}}>
            {renderRoutes(serverRoutes)}
        </StaticRouter>
    );

    res.send(setResponse(html));
});

app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log(`Server running on port ${PORT}`)
});
