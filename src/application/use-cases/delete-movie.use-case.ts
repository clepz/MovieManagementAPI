import { Injectable } from '@nestjs/common';
import MovieRepositoryImpl from '../../infrastructure/database/movie.repository.impl';

@Injectable()
export default class DeleteMovieUseCase {
    constructor(private readonly movieRepository: MovieRepositoryImpl) {}

    async execute(id: string) {
        return await this.movieRepository.removeMovie(id);
    }
}
