import mongoose from "mongoose";

const ConnectDB= async () => { 
    try {
        const connectionInstance= await mongoose.connect(process.env.MONGODB_URI)
        console.log(`DB connected to ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("DB connection error",error);
    }
 }

export default ConnectDB;