const amqplib = require('amqplib');
const bluebird = require('bluebird');
const dotenv = require('dotenv');
const pgp = require('pg-promise');

const dbConfig = require('./lib/database');
const rabbitConfig = require('./lib/rabbit');
const consumersConfig = require('./lib/consumers');
const probabilityConfig = require('./lib/probability');

(async() => {
    dotenv.config();

    const db = dbConfig(bluebird, pgp);
    const rabbit = await rabbitConfig(amqplib);

    const probability = probabilityConfig(db);

    await consumersConfig(rabbit.channel, probability);
})().catch(err => {
    console.error(err);
});