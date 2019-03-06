"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const connect = (env) => {
    const app = express();

    return new Promise((resolve, reject) => {
        app.use("/", bodyParser.urlencoded({ extended: false }));

        app.listen(env.APP_PORT, () => {
            resolve(app);
        });
    });
};

module.exports = connect;

