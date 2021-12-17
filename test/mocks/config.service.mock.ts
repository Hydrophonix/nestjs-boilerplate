// Instrumwents
import { AppConfig } from "../../src/config";

interface MockConfigService extends AppConfig {
    get: (key: keyof AppConfig) => any;
}

export const mockConfigService: MockConfigService = {
    get(key: keyof AppConfig) {
        return this[ key ];
    },

    COOKIE_MAX_AGE:   73,
    COOKIE_SECRET:    "test secret",
    DATABASE_URI:     "test uri",
    HASH_SALT_ROUNDS: 3,
    IS_PROD:          false,
    JWT_EXPIRATION:   "test expiration",
    JWT_SECRET:       "test jwt",
    NODE_ENV:         "dev",
    REDIS_HOST:       "test redis host",
    REDIS_PORT:       99,
};
