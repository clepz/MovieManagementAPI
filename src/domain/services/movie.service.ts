import { Injectable, NotFoundException } from '@nestjs/common';
import Movie from '../entities/movie.entity';
import { ModifyMovieDto } from '../../application/dtos/modify-movie.dto';
import MovieRepositoryImpl from '../repositories/movie.repository.impl';
import MovieMapper from '../mappers/movie.mapper';
import { GetAllMoviesQueryDto } from '../../application/dtos/get-all-movies-query.dto';

@Injectable()
export default class MovieService {
    constructor(private readonly movieRepository: MovieRepositoryImpl) {}

    async getAllAvailableMovies(query: GetAllMoviesQueryDto): Promise<Movie[]> {
        const {
            title,
            ageRestriction,
            minAgeRestriction,
            maxAgeRestriction,
            sortField,
            sortOrder,
        } = query;
        const filters: Partial<Movie> = {};
        if (title) filters.title = title;
        if (ageRestriction) filters.ageRestriction = ageRestriction;

        return this.movieRepository.getAllAvailableMovies(
            filters,
            minAgeRestriction,
            maxAgeRestriction,
            sortField,
            sortOrder,
        );
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
    ): Promise<boolean> {
        const ret = await this.movieRepository.updateById(
            id,
            MovieMapper.fromModifyMovieDto(modifiedMovie, userId),
        );
        if (!ret) {
            throw new NotFoundException('Movie not found');
        }
        return true;
    }
}
