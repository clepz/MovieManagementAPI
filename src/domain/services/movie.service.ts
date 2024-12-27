import { Injectable } from '@nestjs/common';
import Movie from '../entities/movie.entity';
import MovieRepositoryImpl from '../../infrastructure/database/movie.repository.impl';
import { ModifyMovieDto } from '../../application/dtos/modify-movie.dto';
import MovieMapper from '../../application/mappers/movie.mapper';

@Injectable()
export default class MovieService {
    constructor(private readonly movieRepository: MovieRepositoryImpl) {}

    async getMovies(): Promise<Movie[]> {
        return this.movieRepository.getAllAvailableMovies();
    }

    async getMovieById(id: string, retrieveSessions?: boolean): Promise<Movie> {
        if (retrieveSessions) {
            return this.movieRepository.findByIdWithSessions(id);
        }
        return this.movieRepository.findById(id);
    }

    async modifyMovie(
        id: string,
        modifiedMovie: ModifyMovieDto,
        userId: string,
    ): Promise<void> {
        await this.movieRepository.updateById(
            id,
            MovieMapper.fromModifyMovieDto(modifiedMovie, userId),
        );
    }
}
