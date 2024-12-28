import { AsyncLocalStorage } from 'node:async_hooks';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

interface ContextStore {
    correlationId: string;
}

export const globalStore = new AsyncLocalStorage<ContextStore>();

export const withCorrelationId = (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    const correlationId =
        (request.headers['x-correlation-id'] as string) ?? uuid();
    const context: ContextStore = { correlationId };

    globalStore.run(context, () => {
        response.setHeader('x-correlation-id', correlationId);
        next();
    });
};
