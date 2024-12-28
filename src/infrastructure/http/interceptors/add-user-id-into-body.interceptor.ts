import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AddUserIdIntoBodyInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        const request = context.switchToHttp().getRequest<Request>();
        const userId = request.user?.sub;

        if (userId) {
            request.body.userId = userId;
        }

        return next.handle();
    }
}
