module.exports = async (channel, probability, plays) => {
    const createQueue = async (exchangeName, action) => {
        channel.assertExchange(exchangeName, 'fanout');

        const q = await channel.assertQueue('', {
            exclusive: true
        });

        channel.bindQueue(q.queue, exchangeName, '');

        channel.consume(q.queue, (message) => {
            if (message.content) {
                action(JSON.parse(message.content.toString()));
            }
        }, {
            noAck: true
        });
    };

    await createQueue('game_data_imported', probability.updateGameProbability);
    await createQueue('game_data_imported', probability.updatePlayWP);
    await createQueue('game_data_imported', plays.importGame);
};
