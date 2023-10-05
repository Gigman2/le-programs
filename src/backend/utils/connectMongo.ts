import mongoose from "mongoose";
import { dbName, dbUrl } from "../config/env";

const MONGODB_URI: string = `${dbUrl}/${dbName}`

export const connectMongo = async () => mongoose.connect(MONGODB_URI) 