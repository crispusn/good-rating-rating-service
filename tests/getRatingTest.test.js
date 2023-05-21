import Rating from "../models/Rating.js";
import kafka from "../configs/kafkaConfig.js";
import { mongoDbConnect } from "../configs/dbConfig.js";
import { mongoDbDisconnect } from "../configs/dbConfig.js";
import consumeMessage from "../consumeMessage.js";
import produceMessage from "../produceMessage.js";
import * as dotenv from 'dotenv'
import { addRating } from "../services/ratingService.js";
import { getRatingHandler } from "../getRatingHandler.js";
dotenv.config()

describe('get rating test', () => {
    let consumer;
    let producer;
    let topic = "rating"
    let groupId = 'rating-group';
    const userIdTest = 'sample_user_id';
    const productIdTest = 'sample_product_id';
    const ratingLow = 2;
    const ratingHigh = 8;
    const ratingMiddle = 5;
    const ratingWrong = 20;
    const ratingNonInteger = 5.8;
    const userId2Test = 'sample_user_id_2';
    const productId2Test = 'sample_product_id_2';

    beforeAll(async () => {

        const admin = kafka.admin()


        await admin.connect()

        const topics = await admin.listTopics()


        await admin.deleteTopics({ topics })


        await admin.disconnect()

        await mongoDbConnect()
        consumer = kafka.consumer({ groupId: groupId })
        await consumer.disconnect()
        try {

            await Rating.deleteMany({});
            await addRating(ratingHigh, userIdTest, productIdTest);



        } catch (err) {
            console.log(err)

        }
    }, 10000)

    afterAll(async () => {
        await producer.disconnect();
        await mongoDbDisconnect()
    });

    afterEach(async () => {
        await consumer.disconnect();
    })

    
    it('topic: rating, groupId: rating-group should consume message', async () => {
        let ratingInfo;
        let message = JSON.stringify({
            userId: userIdTest,
            productId: productIdTest,
            from: userId2Test,
            operationType: 'getRating'
        })

        try {
            producer = await produceMessage(topic, userIdTest+productIdTest, message);

        } catch (err) {
            console.log(err, 'producer error')
        }
        const messageHandler = async (message) => {
            try {
                const { operationType } = JSON.parse(message.value);
                switch (operationType) {

                    case 'getRating':
                        const {
                            userId,
                            productId,
                            from,
                            operationType } = JSON.parse(message.value);
                        ratingInfo = { userId, productId, from, operationType };

                        break;



                    default:
                        console.log("default")
                }

            } catch (err) {
                console.log(err)
                throw err;
            }

        };

        await new Promise(async (resolve) => {

            consumer = await consumeMessage(topic, groupId, messageHandler, resolve);

        })

        expect(JSON.stringify(ratingInfo)).toEqual(message);

    }, 10000);

    it('should consumer get a rating ', async () => {
        let productRating;
        let message = JSON.stringify({
            userId: userIdTest,
            productId: productIdTest,
            from: userId2Test,
            operationType: 'getRating'
        })

        try {
            producer = await produceMessage(topic, userIdTest+productIdTest, message);

        } catch (err) {
            console.log('producer error', err)
        }
        const messageHandler = async (message) => {
            try {
                const { operationType } = JSON.parse(message.value);
                switch (operationType) {

                    case 'getRating':


                        productRating = await getRatingHandler(message, true)
                        break;
                    default:
                        console.log("default")
                }

            } catch (err) {
                throw err;
            }

        };


        await new Promise(async (resolve) => {

            consumer = await consumeMessage(topic, groupId, messageHandler, resolve);


        })
        expect(productRating._id.userId).toEqual(userIdTest);
        expect(productRating._id.productId).toEqual(productIdTest);
        expect(productRating.rating).toEqual(ratingHigh);

    }, 10000)

    it('should make error if rating does not exist', async () => {
        let message = JSON.stringify({
            userId: userId2Test,
            productId: productIdTest,
            from: userId2Test,
            operationType: 'getRating'
        })

        // Produce a message
        try {
            producer = await produceMessage(topic, userIdTest+productIdTest, message);

        } catch (err) {
            console.log('producer error', err)
        }


        // Consume the message
        const messageHandler = async (message) => {
            const { from } = JSON.parse(message.value);

            try {
                const { operationType } = JSON.parse(message.value);
                switch (operationType) {

                    case 'getRating':

                        product = await getRatingHandler(message, true)
                        break;

                    default:
                        console.log("default")
                }

            } catch (err) {
                expect(err._id).toEqual(userIdTest + productIdTest + from)
                expect(err.message).toEqual('user did not rate this product')
            }

        };
        await new Promise(async (resolve) => {
            consumer = await consumeMessage(topic, groupId, messageHandler, resolve);


        })
    }, 10000)

})