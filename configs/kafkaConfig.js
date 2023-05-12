import { Kafka } from 'kafkajs';
import * as dotenv from 'dotenv'
dotenv.config()

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [`${process.env.KAFKA_HOST
        || 'localhost'}:${process.env.KAFKA_PORT
        || '9092'}`]
});

export default kafka