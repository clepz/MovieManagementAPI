import { configDotenv } from 'dotenv';

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
    access_token_secret: string;
    refresh_token_secret: string;
    access_token_expires_in: string;
    refresh_token_expires_in: string;
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
    access_token_secret: getEnvVar('ACCESS_TOKEN_SECRET'),
    refresh_token_secret: getEnvVar('REFRESH_TOKEN_SECRET'),
    access_token_expires_in: getEnvVar('ACCESS_TOKEN_EXPIRES_IN'),
    refresh_token_expires_in: getEnvVar('REFRESH_TOKEN_EXPIRES_IN'),
    log_dir: getEnvVar('LOG_DIR', './logs'),
    console_log_level: getEnvVar(
        'CONSOLE_LOG_LEVEL',
        getEnvVar('ENV') !== 'production' ? 'debug' : 'info',
    ),
};

export default () => appConfiguration;
