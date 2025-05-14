import { connect } from "mongoose";
const dbConnect = async () => {
    const uri = process.env.MONGODB_URI;
    try {
        const mongoDbConnection = await connect(uri)
        console.log(`MongoDB Connected... : ${mongoDbConnection.connection.host}`)
    } catch (error) {
        console.log(`MongoDB Connection Failed...: ${error}`)
    }
};
export default dbConnect;