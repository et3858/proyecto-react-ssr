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
import getManifest from "./getManifest";

dotenv.config();

const { NODE_ENV, PORT } = process.env;
const app = express();

if (NODE_ENV === "development") {
    const webpackConfig = require("../../webpack.config");
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackHotMiddleware = require("webpack-hot-middleware");
    const compiler = webpack(webpackConfig);
    const serverConfig = {
        serverSideRender: true,
        publicPath: webpackConfig.output.publicPath
    };

    app.use(webpackDevMiddleware(compiler, serverConfig));
    app.use(webpackHotMiddleware(compiler));
} else {
    app.use((req, res, next) => {
        if (!req.hashManifest) req.hashManifest = getManifest();
        next();
    });

    app.use(express.static(`${__dirname}/public`));
    app.use(helmet());
    app.use(helmet.permittedCrossDomainPolicies());
    app.disable("x-powered-by");
}

const setResponse = (html, manifest) => {
    const mainStyles = manifest ? manifest["main.css"] : "assets/main.css";
    const mainBuild = manifest ? manifest["main.js"] : "assets/bundle.js";
    const vendorBuild = manifest ? manifest["vendors.js"] :  "assets/vendor.js";

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
        <script src="${mainBuild}" type="text/javascript"></script>
        <script src="${vendorBuild}" type="text/javascript"></script>`
    );

    return indexHTML;
};

const renderApp = (req, res) => {
    const html = renderToString(
        <StaticRouter location={req.url} context={{}}>
            <Layout>
                {renderRoutes(serverRoutes)}
            </Layout>
        </StaticRouter>
    );

    res.send(setResponse(html, req.hashManifest));
};

app.get("*", renderApp);

app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log(`Server running on port ${PORT}`)
});
