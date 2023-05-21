
import produceMessage from "./produceMessage.js";
import { reRate } from "./services/ratingService.js";


export const rerateHandler = async (message, test = false) => {
    const { productId, userId, newRate } = JSON.parse(message.value);

    let productRating;
    try {


        productRating = await reRate(userId, productId, newRate);
        if (test) {

            return productRating;

        }


        await produceMessage('rating', productRating._id.userId + productRating._id.productId, JSON.stringify({
            productRating,
            operationType: "rerated"
        }))



    } catch (err) {
        err._id = productRating._id.userId + productRating._id.productId;
        throw err;
    }

};


