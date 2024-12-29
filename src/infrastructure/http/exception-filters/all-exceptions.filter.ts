import {
    Catch,
    ArgumentsHost,
    ExceptionFilter,
    HttpStatus,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from '../../../shared/services/custom-logger.service';

// catch all errors to log and response
@Catch()
export default class GeneralExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerService) {}
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        // const req = ctx.getRequest<Request>();
        const res = ctx.getResponse<Response>();
        res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        this.logger.error('', exception);
        if (exception instanceof HttpException) {
            const response = exception.getResponse();
            const status = exception.getStatus();
            res.status(status).json(response);
            return;
        }
        //! Must be an alert here to notify.
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Internal Server Error',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
    }
}
