import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import BaseRepository from './base.repository';
import Movie from '../../domain/entities/movie.entity';

@Injectable()
export default class MovieRepositoryImpl extends BaseRepository<Movie> {
    constructor(
        @InjectRepository(Movie)
        protected readonly repository: Repository<Movie>,
    ) {
        super();
    }

    async removeMovie(id: string): Promise<boolean> {
        return await this.softRemove(id, ['sessions']);
    }
}
