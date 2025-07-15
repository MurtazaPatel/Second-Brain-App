import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import UserRouter from "./routes/user";

dotenv.config({ path: './.env' })
const app = express();
const mongo = process.env.MONGO_URL;
if (!mongo) {
    throw new Error("❌ MONGO_URL is not defined in the .env file");
}

app.use(express.json());

//user endpoints

app.use("/api/v1/user/", UserRouter);

async function main() {
    if (!mongo) {
        throw new Error("❌ MONGO_URL is not defined in the .env file");
    }

    await mongoose.connect(mongo).then(() => {
        console.log('✅ Connected to MongoDB');
    }).catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });

    app.listen(3000, () => {
        console.log("Listening at port 3000....")
    })
}

main();