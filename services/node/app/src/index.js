"use strict";

const express = require("express");
const randomstring = require("randomstring");
const join = require("url-join");
const Entities = require("html-entities").XmlEntities;

const db = require("./db");
const http = require("./http");
const generated = require("./tpl");

const env = {
    APP_PORT: process.env.APP_PORT,
    APP_DB_PORT: process.env.APP_DB_PORT,
    APP_DB_NAME: process.env.APP_DB_NAME,
    APP_DB_HOST: process.env.APP_DB_HOST,
    APP_ROOT: process.env.APP_ROOT,
};
console.info("Staring shortener", env);

const HASH_LENGTH = 6;
const HTTP_SERVER_ERROR = 500;
const HTTP_NOT_FOUND = 404;
const HTTP_BAD_REQUEST = 400;

const entities = new Entities();

(async () => { // eslint-disable-line max-lines-per-function
    try {
        const mongo = await db(env);
        console.info("DB ready");
        const app = await http(env);
        console.info("HTTP ready");

        const collection = mongo.collection("documents");

        app.get("/", (req, res) => {
            res.send("λ λ λ");
        });

        app.use("/@", express.static("src/static"));

        app.post("/@", async (req, res) => {
            try {
                const url = req.body.url;
                if (!url || !url.includes(":")) {
                    res.sendStatus(HTTP_BAD_REQUEST);
                    return;
                }
                const link = randomstring.generate(HASH_LENGTH);
                await collection.insert({
                    link,
                    url,
                });
                res.redirect("/" + link + "?");
                // @todo check for dupes
            }
            catch (e) {
                console.error(e);
                res.sendStatus(HTTP_SERVER_ERROR);
            }
        });

        app.get("/:link", async (req, res) => {
            try {
                const result = await collection.findOne({ link: req.params.link });
                if (!result) {
                    res.sendStatus(HTTP_NOT_FOUND);
                    return;
                }
                if (req.url.includes("?")) {
                    const tpl = await generated();
                    const html = tpl
                        .replace("%link%", result.link)
                        .replace("%url%", join(env.APP_ROOT, result.link))
                        .replace("%target%", entities.encode(result.url));
                    res.send(html);
                    return;
                }
                res.redirect(result.url);
            }
            catch (e) {
                console.error(e);
                res.sendStatus(HTTP_SERVER_ERROR);
            }
        });

        app.get("*", (req, res) => {
            res.sendStatus(HTTP_NOT_FOUND);
        });
    }
    catch (e) {
        console.error("App can't start", e);
    }
})();
