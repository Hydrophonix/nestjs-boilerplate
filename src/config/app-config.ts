export interface AppConfig {
    DATABASE_URI: string;
    NODE_ENV: string;
    IS_PROD: boolean;
    JWT_SECRET: string;
    JWT_EXPIRATION: string;
    COOKIE_SECRET: string;
    COOKIE_MAX_AGE: number;
    HASH_SALT_ROUNDS: number;
    REDIS_PORT: number;
    REDIS_HOST: string;
}

export default (): AppConfig => ({
    DATABASE_URI:     process.env.DATABASE_URI || "mongodb://localhost:27017/nest-boilerplate",
    NODE_ENV:         process.env.NODE_ENV || "development",
    IS_PROD:          process.env.NODE_ENV === "production",
    JWT_SECRET:       process.env.JWT_SECRET || "test-secret",
    JWT_EXPIRATION:   "14d",
    COOKIE_MAX_AGE:   1000 * 60 * 60 * 24 * 7 * 2,
    COOKIE_SECRET:    process.env.COOKIE_SECRET || "test-cookie-secret",
    HASH_SALT_ROUNDS: 10,
    REDIS_HOST:       process.env.REDIS_HOST || "localhost",
    REDIS_PORT:       parseInt(process.env.REDIS_PORT, 10) || 6379,
});
