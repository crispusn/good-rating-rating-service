
import produceMessage from "./produceMessage.js";
import { addRating } from "./services/ratingService.js";


export const addRatingHandler = async (message, test = false) => {
    const { rating, userId, productId } = JSON.parse(message.value);
    let productRating;
    try {


        productRating = await addRating(rating, userId, productId);
        console.log(productRating)
        if (test) {

            return productRating;

        }


        await produceMessage('rating', productRating._id, JSON.stringify({
            productRating,
            userId,
            operationType: "addedRating"
        }))



    } catch (err) {
        err._id = userId;
        throw err;
    }

};


