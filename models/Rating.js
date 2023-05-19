import mongoose from "mongoose";
const Schema = mongoose.Schema;


const RatingSchema = new Schema({
    rating: {
        type: mongoose.SchemaTypes.Number,
        min: 0,
        max: 10,
        required: true,
        validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
        }
    },
    _id: {
        userId: { type: mongoose.SchemaTypes.String, required: true },
        productId: { type: mongoose.SchemaTypes.String, required: true },
    },
}, {_id: false})


const Rating = mongoose.model('Rating', RatingSchema)
export default Rating;