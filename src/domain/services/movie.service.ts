import { Injectable, NotFoundException } from '@nestjs/common';
import Movie from '../entities/movie.entity';
import { ModifyMovieDto } from '../../application/dtos/modify-movie.dto';
import MovieRepositoryImpl from '../repositories/movie.repository.impl';
import MovieMapper from '../mappers/movie.mapper';
import { GetAllMoviesQueryDto } from '../../application/dtos/get-all-movies-query.dto';
import Role from '../../shared/enums/role.enum';

@Injectable()
export default class MovieService {
    constructor(private readonly movieRepository: MovieRepositoryImpl) {}

    async getAllAvailableMovies(
        query: GetAllMoviesQueryDto,
        userRole: Role,
    ): Promise<Movie[]> {
        const {
            title,
            ageRestriction,
            minAgeRestriction,
            maxAgeRestriction,
            sortField,
            sortOrder,
            isAvailable,
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
            userRole === Role.MANAGER ? isAvailable : true,
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
