
import produceMessage from "./produceMessage.js";

export const unratedHandler = async (message, test = false) => {
    try {
        const { _id} = JSON.parse(message.value);

        await produceMessage('rating-final', _id, JSON.stringify({
            _id,
            operationType: "unrated"
        }))
    } catch (err) {
        throw err;
    }

};
