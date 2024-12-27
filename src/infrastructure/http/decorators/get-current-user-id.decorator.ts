import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetCurrentUserId = createParamDecorator(
    (_: undefined, context: ExecutionContext): string => {
        const request = context.switchToHttp().getRequest<Request>();
        const payload = request.user;
        return payload.sub;
    },
);
