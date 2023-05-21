
import produceMessage from "./produceMessage.js";
import { getRating } from "./services/ratingService.js";

export const getRatingHandler = async (message, test = false) => {
    const { userId, productId, from } = JSON.parse(message.value);

    try {


        const productRating = await getRating(userId, productId);
        if (test) {

            return productRating;

        }


        await produceMessage('rating', productRating._id.userId + productRating._id.productId, JSON.stringify({
            productRating,
            from,
            operationType: "gotRating"
        }))



    } catch (err) {
        err._id = userId + productId + from;
        throw err;
    }

};


