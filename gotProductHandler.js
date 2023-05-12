
import produceMessage from "./produceMessage.js";

export const gotRatingHandler = async (message, test = false) => {
    try {


        const { productRating, userId } = JSON.parse(message.value);

        await produceMessage('rating-final', productRating._id, JSON.stringify({
            productRating,
            userId,
            operationType: "gotRating"
        }))



    } catch (err) {
        throw err;
    }

};