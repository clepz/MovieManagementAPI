import { Injectable } from '@nestjs/common';

@Injectable()
export default class BuyTicketUseCase {
    async execute(): Promise<void> {
        console.log('Buying ticket...');
    }
}
