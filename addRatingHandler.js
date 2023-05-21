
import produceMessage from "./produceMessage.js";
import { addRating } from "./services/ratingService.js";


export const addRatingHandler = async (message, test = false) => {
    const { rating, userId, productId } = JSON.parse(message.value);
    let productRating;
    try {


        productRating = await addRating(rating, userId, productId);
        if (test) {

            return productRating;

        }


        await produceMessage('rating', userId+productId, JSON.stringify({
            productRating,
            operationType: "addedRating"
        }))



    } catch (err) {
        err._id = userId+productId;
        throw err;
    }

};


