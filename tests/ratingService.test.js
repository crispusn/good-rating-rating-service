import { mongoDbConnect, mongoDbDisconnect } from "../configs/dbConfig"
import Rating from "../models/Rating";
import { addRating, reRate, unRate } from "../services/ratingService.js"

describe('ratingService tests', () => {
    const userId = 'sample_user_id';
    const productId = 'sample_product_id';
    const ratingLow = 2;
    const ratingHigh = 8;
    const ratingMiddle = 5;
    
    
    beforeAll(async () => {
        try {
            await mongoDbConnect();
            await Rating.deleteMany({})
        } catch (err) {
            throw err;
        }

    })
    
    afterAll(async () => {
        await mongoDbDisconnect()
    })
    it('should rate a product', async () => {
        try {
            const productRating = await addRating(ratingLow, userId, productId);

            if (productRating) {
                expect(productRating._id.userId).toEqual(userId);
                expect(productRating._id.productId).toEqual(productId);
                expect(productRating.rating).toEqual(ratingLow);
            }

        } catch (err) {
            throw err;
        }

    })

    it('should rerate a product', async () => {
        try {
            const productRating = await reRate(userId, productId, ratingHigh);

            if (productRating) {
                expect(productRating._id.userId).toEqual(userId);
                expect(productRating._id.productId).toEqual(productId);
                expect(productRating.rating).toEqual(ratingHigh);
            }
        } catch (err) {
            throw err;
        }
    })

    it('should not rate a product if already rated', async () => {
        try {
            const productRating = await addRating(ratingLow, userId, productId);
            // NOT COMPLETED
            if (productRating) {
                expect(productRating._id.userId).toEqual(userId);
                expect(productRating._id.productId).toEqual(productId);
                expect(productRating.rating).toEqual(ratingLow);
            }

        } catch (err) {
            throw err;
        }
    })

    it('should unrate a product', async () => {
        try {
            const productRating = await unRate(userId, productId);

            if (productRating) {
                expect(productRating.deletedCount).toEqual(1);
                
            }

        } catch (err) {
            throw err;
        }
    })

    // it('should rate a product', () => {
    //     // WILL BE IMPLEMENTED
    // })

    // it('should rate a product', () => {
    //     // WILL BE IMPLEMENTED
    // })

    // it('should rate a product', () => {
    //     // WILL BE IMPLEMENTED
    // })

    // it('should rate a product', () => {
    //     // WILL BE IMPLEMENTED
    // })


})