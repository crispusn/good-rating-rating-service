
import produceMessage from "./produceMessage.js";
import { editRating } from "./services/productService.js"


export const editRatingHandler = async (message, test = false) => {
    const { filter, update, userId } = JSON.parse(message.value);

    let productRating;
    try {


        productRating = await editRating(filter, update);
        if (test) {

            return productRating;

        }


        await produceMessage('rating', productRating._id, JSON.stringify({
            productRating,
            userId,
            operationType: "editedRating"
        }))



    } catch (err) {
        err._id = filter._id;
        throw err;
    }

};


