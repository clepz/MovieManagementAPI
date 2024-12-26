import { NextFunction, Request, Response } from 'express';
import { v7 as uuid } from 'uuid';

export function correlationIdMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // req.logger = Logger.child({ correlationId: req.correlationId })
    res.setHeader('X-Correlation-ID', uuid());
    next();
}
