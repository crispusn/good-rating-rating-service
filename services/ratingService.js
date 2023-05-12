import Product from "../models/Rating.js";

export const addRating = async (rating, userId, productId) => {
    try {
        const productRating = await new Rating({
            rating,
            userId,
            productId,
        }).save()
        if (productRating) {
            return productRating
        }
    } catch (error) {
        throw error
    }
}


export const deleteRating = async (_id) => {
    try {
        const checkRating = await Product.findOne({ _id: _id });

        if (!checkRating) {
            throw new Error('user did not rate');
        }
        return await Product.deleteOne({ _id: _id })


    } catch (error) {
        throw error
    }
}

export const editRating = async (filter, update) => {

    try {
        filter = JSON.parse(filter)
        update = JSON.parse(update)
        const checkRating = await Product.findOne(filter);

        if (!checkRating) {
            throw new Error('user did not rate');
        }

        return await Rating.findOneAndUpdate(filter, update, { new: true })

    } catch (err) {
        throw err;
    }



}
export const getRating = async (_id) => {
    try {
        const checkRating = await Product.findOne({ _id });

        if (!checkRating) {
            throw new Error('user did not rate');
        }


        return await Rating.findOne({ _id: _id })
    } catch (error) {
        throw error
    }

}