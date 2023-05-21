import kafka from "./configs/kafkaConfig.js";



const consumeMessage = async (topic, groupId, messageHandler, resolve = null) => {
    try {
        const consumer = kafka.consumer({ groupId });
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: true });
        await consumer.run({
            eachMessage: async ({ message }) => {
                try {
                    await messageHandler(message);
                    resolve && resolve();

                } catch (err) {
                    resolve && resolve();

                    throw err
                }

            },
        });
        return consumer;
    } catch (err) {
        throw err;

    }

};

export default consumeMessage;