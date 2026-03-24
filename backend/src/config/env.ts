import dotenv from 'dotenv';

dotenv.config();

export const env = {
    PORT: process.env.PORT || '8080',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    DATABASE_URL: process.env.DATABASE_URL || ''
};