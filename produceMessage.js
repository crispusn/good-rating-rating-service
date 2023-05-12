import kafka from "./configs/kafkaConfig.js";

const producer = kafka.producer();

const produceMessage = async (topic, key, message) => {
    try {
        await producer.connect();


        await producer.send({
            topic,
            key,
            messages: [{
                value: message

            }],
        });
        return producer;


    } catch (err) {
        throw err
    }



};

export default produceMessage;