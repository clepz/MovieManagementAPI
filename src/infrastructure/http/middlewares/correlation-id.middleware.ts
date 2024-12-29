import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v7 as uuid } from 'uuid';
import {
    ContextStore,
    correlationIdGlobalStore,
} from '../../../shared/utils/correlationId-global-store';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
    use(request: Request, response: Response, next: NextFunction) {
        const correlationId =
            (request.headers['x-correlation-id'] as string) ?? uuid();
        const context: ContextStore = { correlationId };

        correlationIdGlobalStore.run(context, () => {
            response.setHeader('x-correlation-id', correlationId);
            next();
        });
    }
}
