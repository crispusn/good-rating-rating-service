
import produceMessage from "./produceMessage.js";

export const reratedHandler = async (message, test = false) => {
    try {


        const { productRating } = JSON.parse(message.value);

        await produceMessage('rating-final', productRating._id.userId + productRating._id.productId, JSON.stringify({
            productRating,
            operationType: "rerated"
        }))



    } catch (err) {
        throw err;
    }

};
