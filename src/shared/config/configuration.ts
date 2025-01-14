import { configDotenv } from 'dotenv';

// Load environment variables from .env file
let envPostfix = '';
if (process.env.NODE_ENV === 'test') {
    envPostfix = '.test';
}

configDotenv({ path: `.env${envPostfix}` });

interface Config {
    env: string;
    port: number;
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        sync: boolean;
    };
    access_token_secret: string;
    refresh_token_secret: string;
    access_token_expires_in: string;
    refresh_token_expires_in: string;
    log_dir: string;
    console_log_level: string;
    disableConsoleLog: boolean;
}

const requiredEnvVars = [
    'NODE_ENV',
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
    env: getEnvVar('NODE_ENV'),
    port: parseInt(getEnvVar('PORT', '3000'), 10),
    database: {
        host: getEnvVar('DB_HOST', 'localhost'),
        port: parseInt(getEnvVar('DB_PORT', '5432'), 10),
        user: getEnvVar('DB_USER', 'user'),
        password: getEnvVar('DB_PASSWORD', 'password'),
        database: getEnvVar('DB_DB', 'database'),
        // Permit sync database only if NODE_ENV is not production
        sync:
            getEnvVar('NODE_ENV') !== 'production'
                ? getEnvVar('DB_SYNC', 'false') === 'true'
                : false,
    },
    access_token_secret: getEnvVar('ACCESS_TOKEN_SECRET'),
    refresh_token_secret: getEnvVar('REFRESH_TOKEN_SECRET'),
    access_token_expires_in: getEnvVar('ACCESS_TOKEN_EXPIRES_IN'),
    refresh_token_expires_in: getEnvVar('REFRESH_TOKEN_EXPIRES_IN'),
    log_dir: getEnvVar('LOG_DIR', './logs'),
    console_log_level: getEnvVar(
        'CONSOLE_LOG_LEVEL',
        getEnvVar('NODE_ENV') !== 'production' ? 'debug' : 'info',
    ),
    // have to use different name because nestjs config service returns env variable directly (incase sensitive)
    disableConsoleLog: getEnvVar('DISABLE_CONSOLE_LOG', 'false') === 'true',
};

export default () => appConfiguration;
