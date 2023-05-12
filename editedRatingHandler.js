
import produceMessage from "./produceMessage.js";

export const editedRatingHandler = async (message, test = false) => {
    try {


        const { productRating, userId } = JSON.parse(message.value);

        await produceMessage('rating-final', productRating._id, JSON.stringify({
            productRating,
            userId,
            operationType: "editedRating"
        }))



    } catch (err) {
        throw err;
    }

};
