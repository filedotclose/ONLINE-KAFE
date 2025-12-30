import mongoose from "mongoose"
export async function connectDB(){
    try{
        const conn = process.env.DB
        if(!conn){
            throw new Error("connection string invalid");
        }

    await mongoose.connect(conn)
    console.log("MongoDB Connected")
    }catch(error){
        console.error("MongoDB connection failed:", error);
    }finally{
        console.log("This process is finished");
    }
}