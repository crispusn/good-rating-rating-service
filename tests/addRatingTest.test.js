import Rating from "../models/Rating.js";
import kafka from "../configs/kafkaConfig.js";
import { mongoDbConnect } from "../configs/dbConfig.js";
import { mongoDbDisconnect } from "../configs/dbConfig.js";
import consumeMessage from "../consumeMessage.js";
import produceMessage from "../produceMessage.js";
import * as dotenv from 'dotenv'
import { addRatingHandler } from "../addRatingHandler.js";
dotenv.config()

describe('add rating test', () => {
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
            rating: ratingHigh,
            operationType: 'addRating'
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

                    case 'addRating':
                        const {
                            userId,
                            productId,
                            rating,
                            operationType } = JSON.parse(message.value);
                        ratingInfo = { userId, productId, rating, operationType };

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

    it('should consumer rate a product-user pair ', async () => {
        let productRating;
        let message = JSON.stringify({
            userId: userIdTest,
            productId: productIdTest,
            rating: ratingHigh,
            operationType: 'addRating'
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

                    case 'addRating':


                        productRating = await addRatingHandler(message, true)
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

    it('should make error if product already rated', async () => {
        let message = JSON.stringify({
            userId: userIdTest,
            productId: productIdTest,
            rating: ratingHigh,
            operationType: 'addRating'
        })

        // Produce a message
        try {
            producer = await produceMessage(topic, userIdTest+productIdTest, message);

        } catch (err) {
            console.log('producer error', err)
        }


        // Consume the message
        const messageHandler = async (message) => {
            try {
                const { operationType } = JSON.parse(message.value);
                switch (operationType) {

                    case 'addRating':

                        product = await addRatingHandler(message, true)
                        break;

                    default:
                        console.log("default")
                }

            } catch (err) {
                expect(err._id).toEqual(userIdTest+productIdTest)
            }

        };
        await new Promise(async (resolve) => {
            consumer = await consumeMessage(topic, groupId, messageHandler, resolve);


        })
    }, 10000)

})