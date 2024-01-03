import mongoose from "mongoose";
import { dbName, dbUrl } from "../config/env";


export const connectMongo = async (name?: string) => {
    const MONGODB_URI: string = `${dbUrl}/${name || dbName}`
    mongoose.connect(MONGODB_URI)
} 