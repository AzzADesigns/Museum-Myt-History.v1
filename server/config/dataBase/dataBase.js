import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config();


export const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})

const testConection = async () => {
    try {
        const client = await pool.connect();
        console.log('Connection to the database successful');
        console.log(`Data base: ${process.env.DB_NAME}`);
        client.release();
    } catch (error) {
        console.error('Database connection error', error.message);
        throw error;
    }
}

export default testConection;