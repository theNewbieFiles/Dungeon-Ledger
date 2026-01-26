function required(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required env var: ${name}`);
    }
    return value;
}

const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",

    //database
    USER: required("DB_USER"),
    HOST: required("DB_HOST"),
    PORT: required("DB_PORT"),
    DATABASE_NAME: required("DB_NAME"),
    PASSWORD: required("DB_PASSWORD"),

    //token secrets
    ACCESS_TOKEN_SECRET: required("ACCESS_TOKEN_SECRET"),
};

export default env;