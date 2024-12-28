import { Injectable } from '@nestjs/common';
import MovieRepositoryImpl from '../../domain/repositories/movie.repository.impl';

@Injectable()
export default class DeleteMovieUseCase {
    constructor(private readonly movieRepository: MovieRepositoryImpl) {}

    async execute(id: string, userId: string) {
        return await this.movieRepository.removeMovie(id, userId);
    }
}
