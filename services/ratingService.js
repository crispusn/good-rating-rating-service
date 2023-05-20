import Rating from "../models/Rating.js";

export const addRating = async (rating, userId, productId) => {
    try {
        const checkRating = await Rating.findOne({
            _id: {
                userId,
                productId
            }
        });
        
        if (checkRating) {
            throw new Error('Rate is already exist.')
        }

        const productRating = await new Rating({
            rating,
            _id: {
                userId,
                productId
            }
        }).save()
        if (productRating) {
            return productRating
        }
    } catch (error) {
        throw error
    }
}


export const unRate = async (userId, productId) => {
    try {
        const checkRating = await Rating.findOne({
            _id: {
                userId,
                productId
        } });

        if (!checkRating) {
            throw new Error('There is no rating');
        }
        return await Rating.deleteOne({
            _id: {
                userId,
                productId
        } })


    } catch (error) {
        throw error
    }
}

export const reRate = async (userId, productId, newRate) => {

    try {
        
        const checkRating = await Rating.findOne({
            _id: {
                userId,
                productId
        } });

        if (!checkRating) {
            throw new Error('There is no rating');
        }

        return await Rating.findOneAndUpdate({
            _id: {
                userId,
                productId
        } },{rating: newRate}, { new: true })

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