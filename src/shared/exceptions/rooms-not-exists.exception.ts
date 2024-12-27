import { HttpException, HttpStatus } from '@nestjs/common';

export default class RoomsNotExistsException extends HttpException {
    constructor(roomNumbers: number[]) {
        const message = `Rooms not exist: ${roomNumbers.join(', ')}`;
        super(message, HttpStatus.BAD_REQUEST);
    }
}
