import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import { v7 as uuid } from 'uuid';

interface ContextStore {
    correlationId: string;
}

export const globalStore = new AsyncLocalStorage<ContextStore>();

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
    use(request: Request, response: Response, next: NextFunction) {
        const correlationId =
            (request.headers['x-correlation-id'] as string) ?? uuid();
        const context: ContextStore = { correlationId };

        globalStore.run(context, () => {
            response.setHeader('x-correlation-id', correlationId);
            next();
        });
    }
}
