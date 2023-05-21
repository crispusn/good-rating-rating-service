import Rating from "../models/Rating.js";
import kafka from "../configs/kafkaConfig.js";
import { mongoDbConnect } from "../configs/dbConfig.js";
import { mongoDbDisconnect } from "../configs/dbConfig.js";
import consumeMessage from "../consumeMessage.js";
import produceMessage from "../produceMessage.js";
import * as dotenv from 'dotenv'
dotenv.config()

describe('added rating test', () => {
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
    let productRatingTest = {
        _id: {
            userId: userIdTest,
            productId: productIdTest,
        },
       rating: ratingHigh
    }

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
        let _idTest;
        let fromTest;
        let message = JSON.stringify({
            productRating: productRatingTest,
            from: userId2Test,
            operationType: 'gotRating'
        })
        // Produce a message

        try {
            producer = await produceMessage(topic, productRatingTest._id.userId + productRatingTest._id.productId, message);

        } catch (err) {
            console.log(err, 'producer error')
        }
        const messageHandler = async (message) => {
            try {
                const { operationType } = JSON.parse(message.value);
                switch (operationType) {

                    case 'gotRating':
                        const { productRating, from } = JSON.parse(message.value);
                        _idTest = productRating._id.userId + productRating._id.productId;
                        fromTest = from;
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

        // Check if the message is consumed
        expect(_idTest).toEqual(userIdTest + productIdTest)
        expect(fromTest).toEqual(userId2Test);


    }, 10000);


})