
import produceMessage from "./produceMessage.js";

export const addedRatingHandler = async (message, test = false) => {
    try {
        const { productRating, userId } = JSON.parse(message.value);

        await produceMessage('rating-final', productRating._id, JSON.stringify({
            productRating,
            userId,
            operationType: "addedProduct"
        }))
    } catch (err) {
        throw err;
    }

};
