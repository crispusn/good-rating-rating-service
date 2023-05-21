
import produceMessage from "./produceMessage.js";
import { unRate } from "./services/ratingService.js";


export const unrateHandler = async (message, test = false) => {
    const { _id } = JSON.parse(message.value);

    try {


        const deleted = await unRate(_id.userId, _id.productId);
        if (test) {

            return deleted;

        }


        await produceMessage('rating', _id, JSON.stringify({
            _id,
            operationType: "unrated"
        }))



    } catch (err) {
        err._id = _id.userId + _id.productId;
        throw err;
    }

};


