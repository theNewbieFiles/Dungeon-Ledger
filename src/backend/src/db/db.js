
import env from "../config/env.js";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    user: env.USER,
    host: env.HOST,
    port: env.PORT,
    database: env.DATABASE_NAME,
    password: env.PASSWORD,
}); 

pool.connect()
    .then((client) => {
        console.log("Database connected successfully");
        client.release();
    })
    .catch((err) => {
        console.error("Database connection error", err.stack);
        process.exit(1); // stop the app if DB is not reachable
    });

export default pool;        