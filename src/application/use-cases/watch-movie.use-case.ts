import { Injectable } from '@nestjs/common';

@Injectable()
export default class WatchMovieUseCase {
    async execute(ticketId: string): Promise<void> {
        console.log('Watching movie...');
    }
}
