import mongoose from "mongoose";

import { DB_NAME } from "../consents.js";

const connectDB = async()=>{
    try {
        const connectinstant = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDb is connects successfully : ${connectinstant.connection.host}`);
        
    } catch (error) {
        console.log("Error not connect ", error);
        process.exit(1)
        
    }
}

export default connectDB