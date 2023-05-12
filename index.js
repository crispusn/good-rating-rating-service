import { mongoDbConnect } from "./configs/dbConfig.js";
import consumeMessage from "./consumeMessage.js";
import { addRatingHandler } from "./addRatingHandler.js";
import { addedRatingHandler } from "./addedRatingHandler.js";

import produceMessage from "./produceMessage.js";
import { deleteRatingHandler } from "./deleteRatingHandler.js";
import { deletedRatingHandler } from "./deletedRatingHandler.js";
import { editRatingHandler } from "./editRatingHandler.js";
import { editedRatingHandler } from "./editedRatingHandler.js";
import { getRatingHandler } from "./getProductHandler.js";
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

            case 'deleteRating':
                await deleteRatingHandler(message)
                console.log('success2')

                break;
            case 'deletedRating':
                await deletedRatingHandler(message)
                console.log('success2')
            case 'editRating':
                await editRatingHandler(message)
                break;
            case 'editedRating':
                await editedRatingHandler(message)
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
    const consumer = await consumeMessage('rating', 'product-group', messageHandler);


}

main()