import Rating from "../models/Rating";

describe('add rating test', () => {
    let consumer;
    let producer;
    let topic = "rating"
    let groupId = 'rating-group'
    const userId = 'sample_user';
    const productId = 'sapmle_product';
    const rate = 5;

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
    })
})