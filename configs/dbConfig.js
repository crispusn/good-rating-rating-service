import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
dotenv.config()
// Configure MongoDB connection
export async function mongoDbConnect() {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.iz1vu.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch (err) {
        console.log(err)
    }
}

export async function mongoDbDisconnect() {
    await mongoose.disconnect();
}

