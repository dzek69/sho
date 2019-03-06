"use strict";

const fs = require("fs");

let cached = "";

const generated = () => {
    if (cached) {
        return cached;
    }
    return new Promise((resolve, reject) => {
        fs.readFile("src/static/generated.html", (err, content) => {
            if (err) {
                reject(err);
                return;
            }
            cached = String(content);
            resolve(cached);
        });
    });
};

module.exports = generated;
