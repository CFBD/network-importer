const amqplib = require('amqplib');
const bluebird = require('bluebird');
const dotenv = require('dotenv');
const pgp = require('pg-promise');

const dbConfig = require('./lib/database');
const rabbitConfig = require('./lib/rabbit');
const consumersConfig = require('./lib/consumers');
const probabilityConfig = require('./lib/probability');
const playsConfig = require('./lib/plays');
const playTypes = require('./lib/playTypes');

(async() => {
    dotenv.config();

    const db = dbConfig(bluebird, pgp);
    const rabbit = await rabbitConfig(amqplib);

    const probability = probabilityConfig(db);
    const plays = playsConfig(db, playTypes);

    await consumersConfig(rabbit.channel, probability, plays);
})().catch(err => {
    console.error(err);
});