import mongoose from "mongoose";

const DB_NAME = process.env.DB_NAME
const DB_URl = process.env.DB_URL
const MONGODB_URI: string = `${DB_URl}/${DB_NAME}`

export const connectMongo = async () => mongoose.connect(MONGODB_URI) 