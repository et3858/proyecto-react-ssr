import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router } from "react-router";
import App from "./routes/App";
import "./assets/stylesheets/styles.css";

const history = createBrowserHistory();

ReactDOM.hydrate(
    <Router history={history}>
        <App />
    </Router>,
    document.getElementById("app")
);
