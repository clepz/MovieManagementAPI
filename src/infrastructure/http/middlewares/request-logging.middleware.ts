import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import json from 'morgan-json';
import { LoggerService } from '../../../shared/services/custom-logger.service';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const logFormat = json({
    method: ':method',
    remoteAddr: ':remote-addr',
    forwardedFor: ':req[x-forwarded-for]',
    url: ':url',
    status: ':status',
    userAgent: ':user-agent',
    reqContentLength: ':req[content-length]',
    resContentLength: ':res[content-length]',
    responseTime: ':response-time',
});

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
    constructor(private readonly logger: LoggerService) {}

    use(req: Request, res: Response, next: NextFunction) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        morgan(logFormat, {
            stream: {
                write: (str: string) => {
                    this.logger.info(
                        'HTTP request received',
                        JSON.parse(str.trim()),
                    );
                },
            },
        })(req, res, next);
    }
}
