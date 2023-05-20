import { mongoDbConnect, mongoDbDisconnect } from "../configs/dbConfig"
import Rating from "../models/Rating";
import { addRating, reRate, unRate } from "../services/ratingService.js"

describe('ratingService tests', () => {
    const userId = 'sample_user_id';
    const productId = 'sample_product_id';
    const ratingLow = 2;
    const ratingHigh = 8;
    const ratingMiddle = 5;
    const ratingWrong = 20;
    const ratingNonInteger = 5.8;
    const userId2 = 'sample_user_id_2';
    const productId2 = 'sample_product_id_2';
    
    
    beforeAll(async () => {
        try {
            await mongoDbConnect();
            await Rating.deleteMany({})
        } catch (err) {
            throw err;
        }

    }, 10000)
    
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
            
        } catch (err) {
            expect(err.message).toEqual('Rate is already exist.')
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

    it('should not unrate a product if already unrated ', async () => {
        try {
            const productRating = await unRate(userId, productId);
        } catch (err) {
            expect(err.message).toEqual('There is no rating')
        }
    })

    it('should not rerate if a product is not rated', async () => {
        try {
            const productRating = await reRate(userId, productId, ratingMiddle);

        } catch (err) {
            expect(err.message).toEqual('There is no rating')

        }
    })

    it('should not rate if a rate is not in range of [0,10] integer', async () => {
        try {
            const productRating = await addRating(ratingWrong, userId, productId);

        } catch (err) {
            console.log(err);
            expect(err.message).toEqual('Rating validation failed: rating: Path `rating` (20) is more than maximum allowed value (10).')

        }
    })

    it('should not rate if a rate is not integer', async () => {
        try {
            const productRating = await addRating(ratingNonInteger, userId, productId);

        } catch (err) {
            console.log(err);
            expect(err.message).toEqual(`Rating validation failed: rating: ${ratingNonInteger} is not an integer value`)

        }
    })
})