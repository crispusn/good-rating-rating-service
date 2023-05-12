
import produceMessage from "./produceMessage.js";
import { getRating } from "./services/productService.js"


export const getRatingHandler = async (message, test = false) => {
    const { _id, userId } = JSON.parse(message.value);

    try {


        const productRating = await getRating(_id);
        if (test) {

            return productRating;

        }


        await produceMessage('rating', productRating._id, JSON.stringify({
            productRating,
            userId,
            operationType: "gotRating"
        }))



    } catch (err) {
        err._id = _id;
        throw err;
    }

};


