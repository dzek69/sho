"use strict";

const MongoClient = require("mongodb").MongoClient;

const connect = (env) => {
    const url = "mongodb://" + env.APP_DB_HOST + ":" + env.APP_DB_PORT;

    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, client) => {
            if (err) {
                reject(err);
                return;
            }
            const db = client.db(env.APP_DB_NAME);
            resolve(db);
        });
    });
};

module.exports = connect;
