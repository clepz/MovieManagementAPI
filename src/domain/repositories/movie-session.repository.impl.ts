import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import BaseRepository from './base.repository';
import MovieSession from '../entities/movie-session.entity';

@Injectable()
export default class MovieSessionRepositoryImpl extends BaseRepository<MovieSession> {
    constructor(
        @InjectRepository(MovieSession)
        protected readonly repository: Repository<MovieSession>,
    ) {
        super();
    }

    async removeMovieSession(
        id: string,
        movieId: string,
        userId: string,
    ): Promise<boolean> {
        return await this.softRemove({ id, movieId }, [], userId);
    }

    async findByIdAndMovieId(
        id: string,
        movieId: string,
    ): Promise<MovieSession> {
        return await this.repository.findOne({
            where: { id, movieId },
        });
    }

    async findByIdWithMovie(id: string): Promise<MovieSession> {
        return await this.repository.findOne({
            where: { id },
            relations: ['movie'],
        });
    }
}
