import { HttpException, HttpStatus } from '@nestjs/common';

export default class NotAvailableTimeForMovieSessionException extends HttpException {
    constructor(timeDetailMessage: string) {
        super(
            `Time slot is not available for movie session: ${timeDetailMessage}`,
            HttpStatus.CONFLICT,
        );
    }
}
