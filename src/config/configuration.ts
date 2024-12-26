import { configDotenv } from 'dotenv';
import path from 'path';

// Load environment variables from .env file
configDotenv();

interface Config {
    env: string;
    port: number;
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
    };
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
    log_dir: string;
    console_log_level: string;
}

const requiredEnvVars = [
    'ENV',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'ACCESS_TOKEN_EXPIRES_IN',
    'REFRESH_TOKEN_EXPIRES_IN',
];

function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (!value && !defaultValue) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value || defaultValue;
}

function validateEnvVars() {
    requiredEnvVars.forEach((envVar) => {
        getEnvVar(envVar);
    });
}

validateEnvVars();

const appConfiguration: Config = {
    env: getEnvVar('ENV'),
    port: parseInt(getEnvVar('PORT', '3000'), 10),
    database: {
        host: getEnvVar('DB_HOST', 'localhost'),
        port: parseInt(getEnvVar('DB_PORT', '5432'), 10),
        user: getEnvVar('DB_USER', 'user'),
        password: getEnvVar('DB_PASSWORD', 'password'),
        database: getEnvVar('DB_DB', 'database'),
    },
    ACCESS_TOKEN_SECRET: getEnvVar('ACCESS_TOKEN_SECRET'),
    REFRESH_TOKEN_SECRET: getEnvVar('REFRESH_TOKEN_SECRET'),
    ACCESS_TOKEN_EXPIRES_IN: getEnvVar('ACCESS_TOKEN_EXPIRES_IN'),
    REFRESH_TOKEN_EXPIRES_IN: getEnvVar('REFRESH_TOKEN_EXPIRES_IN'),
    log_dir: getEnvVar('LOG_DIR', './logs'),
    console_log_level: getEnvVar(
        'CONSOLE_LOG_LEVEL',
        getEnvVar('ENV') !== 'production' ? 'debug' : 'info',
    ),
};

export default () => appConfiguration;
