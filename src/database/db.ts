import mongoose, { ConnectOptions } from "mongoose";

async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            } as ConnectOptions);
        console.log("Mongodb connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDb;