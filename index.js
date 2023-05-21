import { mongoDbConnect } from "./configs/dbConfig.js";
import consumeMessage from "./consumeMessage.js";
import { addRatingHandler } from "./addRatingHandler.js";
import { addedRatingHandler } from "./addedRatingHandler.js";
import produceMessage from "./produceMessage.js";
import { unrateHandler } from "./unrateHandler.js";
import { unratedHandler } from "./unratedHandler.js";
import { rerateHandler } from "./rerateHandler.js";
import { reratedHandler } from "./reratedHandler.js";
import { getRatingHandler } from "./getRatingHandler.js";
import { gotRatingHandler } from "./gotProductHandler.js";

const messageHandler = async (message) => {
    try {
        const { operationType } = JSON.parse(message.value);
        switch (operationType) {

            case 'getRating':
                await getRatingHandler(message);
                break;
            case 'gotRating':
                await gotRatingHandler(message);
                break;

            case 'unrate':
                await unrateHandler(message)
                console.log('success2')

                break;
            case 'unrated':
                await unratedHandler(message);
                console.log('success2')
            case 'rerate':
                await rerateHandler(message)
                break;
            case 'rerated':
                await reratedHandler(message);
                break;

            case 'addRating':
                await addRatingHandler(message)
                break;
            case 'addedRating':
                await addedRatingHandler(message)
                break;

            default:
                console.log("operation type error")
        }

    } catch (err) {
        console.log(err)
        await produceMessage('rating-final', err._id, JSON.stringify({
            _id: err._id,
            err: err.message,
            operationType: 'error'
        }))
    }

};

async function main() {

    await mongoDbConnect();
    const consumer = await consumeMessage('rating', 'rating-group', messageHandler);


}

main()