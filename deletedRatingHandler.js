
import produceMessage from "./produceMessage.js";

export const deletedRatingHandler = async (message, test = false) => {
    try {
        const { _id, userId } = JSON.parse(message.value);

        await produceMessage('rating-final', _id, JSON.stringify({
            _id,
            userId,
            operationType: "deletedRating"
        }))
    } catch (err) {
        throw err;
    }

};
