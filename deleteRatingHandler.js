
import produceMessage from "./produceMessage.js";
import { deleteRating } from "./services/productService.js"


export const deleteRatingHandler = async (message, test = false) => {
    const { _id, userId } = JSON.parse(message.value);

    try {


        const deleted = await deleteRating(_id);
        if (test) {

            return deleted;

        }


        await produceMessage('rating', _id, JSON.stringify({
            _id,
            userId,
            operationType: "deletedRating"
        }))



    } catch (err) {
        err._id = _id;
        throw err;
    }

};


