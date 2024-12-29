import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModuleAsyncOptions } from 'nest-winston';
import winston, { transport } from 'winston';
import 'winston-daily-rotate-file';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = (configService: ConfigService) => {
    const env = configService.get<string>('NODE_ENV');
    const isDevelopment = env !== 'production';
    return isDevelopment ? 'debug' : 'warn';
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(
        ({ message, timestamp, level, stack, correlationId, ...meta }) => {
            let metaMessage = '';
            if (stack) {
                message = (message as string) + '\n' + (stack as string);
            }
            if (Object.keys(meta).length !== 0) {
                metaMessage += ` ${JSON.stringify(meta)}`;
            }
            const correlationIdMessage = correlationId
                ? ` ${correlationId} `
                : ' ';
            return `${String(timestamp)}${correlationIdMessage}${level}: ${message}${metaMessage}`;
        },
    ),
);

const formatColored = winston.format.combine(
    format,
    winston.format.colorize({ all: true }),
);

const formatFile = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.splat(),
);

const options = (configService: ConfigService) => {
    const consoleLogDisabled = configService.get('disableConsoleLog', {
        infer: true,
    });
    return {
        daily_file: {
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            dirname: configService.get<string>('log_dir'),
            level: 'info',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            auditFile: `${configService.get<string>('log_dir')}/audit.json`,
            format: formatFile,
        },
        console: consoleLogDisabled
            ? undefined
            : {
                  level: configService.get<string>('console_log_level'),
                  json: false,
                  colorize: true,
                  format: formatColored,
              },
    };
};

winston.addColors(colors);

const exceptionTransport = (configService: ConfigService) =>
    new winston.transports.File({
        filename: 'exceptions.log',
        dirname: configService.get<string>('log_dir'),
    });

const rejectionTransport = (configService: ConfigService) =>
    new winston.transports.File({
        filename: 'rejections.log',
        dirname: configService.get<string>('log_dir'),
    });

const winstonConfig: WinstonModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
        const opts = options(configService);
        const transports: transport[] = [
            new winston.transports.DailyRotateFile(opts.daily_file),
        ];
        if (opts.console) {
            transports.push(new winston.transports.Console(opts.console));
        }
        return {
            level: level(configService),
            levels,
            transports,
            exitOnError: false,
            exceptionHandlers: [
                exceptionTransport(configService),
                ...(opts.console
                    ? [new winston.transports.Console(opts.console)]
                    : []),
            ],
            rejectionHandlers: [
                rejectionTransport(configService),
                ...(opts.console
                    ? [new winston.transports.Console(opts.console)]
                    : []),
            ],
        };
    },
    inject: [ConfigService],
};

export default winstonConfig;
