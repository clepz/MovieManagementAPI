import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { hashPassword } from 'src/lib/utils/hash-password.util';
import { RegisterUserDto } from '../dtos/RegisterUser.dto';

@Injectable()
export class PasswordHashInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const body: RegisterUserDto = request.body;

        if (body && body.password) {
            body.password = await hashPassword(body.password);
        }

        return next.handle();
    }
}
