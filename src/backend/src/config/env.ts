import { z } from 'zod';

// Define your schema
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DB_USER: z.string(),
    DB_HOST: z.string(),
    DB_PORT: z.string().transform(Number),
    DB_NAME: z.string(),
    DB_PASSWORD: z.string(),
    ACCESS_TOKEN_SECRET: z.string(),
});

const env = envSchema.parse(process.env);

const config = {
    NODE_ENV: env.NODE_ENV,
    USER: env.DB_USER,
    HOST: env.DB_HOST,
    PORT: env.DB_PORT,  // Already a number!
    DATABASE_NAME: env.DB_NAME,
    PASSWORD: env.DB_PASSWORD,
    ACCESS_TOKEN_SECRET: env.ACCESS_TOKEN_SECRET,
};

export default config;