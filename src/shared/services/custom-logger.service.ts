/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { globalStore } from '../middlewares/correlation-id.middleware';

@Injectable()
export class LoggerService {
    constructor(@Inject('winston') private readonly rootLogger: Logger) {}

    private getLogger() {
        try {
            const { correlationId } = globalStore.getStore();
            const childLogger = this.rootLogger.child({
                correlationId,
            });
            return childLogger;
        } catch (e) {
            return this.rootLogger;
        }
    }

    info(message: string, meta?: any) {
        this.getLogger().info(message, meta);
    }

    error(message: string, meta?: any) {
        this.getLogger().error(message, meta);
    }

    warn(message: string, meta?: any) {
        this.getLogger().warn(message, meta);
    }

    debug(message: string, meta?: any) {
        this.getLogger().debug(message, meta);
    }
}
