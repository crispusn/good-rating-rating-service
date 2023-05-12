import mongoose from "mongoose";
const Schema = mongoose.Schema;


const RatingSchema = new Schema({
    rating: { type: mongoose.SchemaTypes.Number, required: true },
    userId: { type: mongoose.SchemaTypes.String, required: true },
    productId: { type: mongoose.SchemaTypes.String, required: true },




})


const Rating = mongoose.model('Rating', RatingSchema)
export default Rating;