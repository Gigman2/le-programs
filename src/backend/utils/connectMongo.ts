import mongoose from "mongoose";

const DB_NAME = process.env.DB_NAME
const DB_URl = process.env.DB_URL
const MONGODB_URI: string = `${DB_URl}/${DB_NAME}`

let connection: typeof mongoose | null = null;

async function connect() {
    if (connection) {
        return connection;
    }

    try {
        const connectionString = MONGODB_URI;
        connection = await mongoose.connect(connectionString);

        console.log('Mongoose connected');
        return connection;
    } catch (error: any) {
        console.error('Error connecting to MongoDB:', error.message);
        throw error;
    }
}

export const connectMongo = connect

