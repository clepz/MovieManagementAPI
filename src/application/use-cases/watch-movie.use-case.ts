import { Injectable } from '@nestjs/common';

@Injectable()
export default class WatchMovieUseCase {
    async execute(): Promise<void> {
        console.log('Watching movie...');
    }
}
