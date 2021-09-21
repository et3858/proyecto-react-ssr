import fs from "fs";
import path from "path";
import express from "express";
import dotenv from "dotenv";
import webpack from "webpack";
import helmet from "helmet";
import React from "react";
import { renderToString } from "react-dom/server";
import { renderRoutes } from "react-router-config";
import { StaticRouter } from "react-router-dom";
import serverRoutes from "../client/routes/routes";
import Layout from "../client/components/Layout";

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

    // read `index.html` file
    let indexHTML = fs.readFileSync(path.resolve(__dirname, "../../public/index.html"), {
        encoding: 'utf8',
    });

    // Add css reference
    indexHTML = indexHTML.replace(
        "<title>",
        `<link rel="stylesheet" href="${mainStyles}" type="text/css">
        <title>`
    );

    // Add js references
    indexHTML = indexHTML.replace(
        "<div id=\"app\"></div>",
        `<div id="app">${html}</div>
        <script src="${mainBuild}" type="text/javascript"></script>`
    );

    return indexHTML;

    // return (`
    //     <!DOCTYPE html>
    //     <html lang="en">
    //     <head>
    //         <meta charset="UTF-8">
    //         <meta http-equiv="X-UA-Compatible" content="IE=edge">
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //         <link rel="stylesheet" href="${mainStyles}" type="text/css">
    //         <title>Proyecto React con SSR</title>
    //     </head>
    //     <body>
    //         <div id="app">${html}</div>
    //         <script src="${mainBuild}" type="text/javascript"></script>
    //         <script src="${vendorBuild}" type="text/javascript"></script>
    //     </body>
    //     </html>
    // `);
};

const renderApp = (req, res) => {
    const html = renderToString(
        <StaticRouter location={req.url} context={{}}>
            <Layout>
                {renderRoutes(serverRoutes)}
            </Layout>
        </StaticRouter>
    );

    res.send(setResponse(html));
};

app.get("*", renderApp);

app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log(`Server running on port ${PORT}`)
});
