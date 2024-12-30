import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import BaseRepository from './base.repository';
import Movie from '../../domain/entities/movie.entity';
import { MovieQuerySortField } from '../../application/dtos/get-all-movies-query.dto';
import { SortOrder } from '../../shared/enums/querying.enum';

@Injectable()
export default class MovieRepositoryImpl extends BaseRepository<Movie> {
    constructor(
        @InjectRepository(Movie)
        protected readonly repository: Repository<Movie>,
    ) {
        super();
    }

    async removeMovie(id: string, userId: string): Promise<boolean> {
        return await this.softRemove({ id }, ['sessions'], userId);
    }

    async findByIdWithSessions(id: string): Promise<Movie> {
        return await this.repository.findOne({
            where: { id },
            relations: ['sessions'],
        });
    }

    async getAllAvailableMovies(
        filters: Partial<Movie>,
        minAgeRestriction?: number,
        maxAgeRestriction?: number,
        sortField: MovieQuerySortField = MovieQuerySortField.TITLE,
        sortOrder: SortOrder = SortOrder.ASC,
        isAvailable = true,
    ): Promise<Movie[]> {
        const queryBuilder = this.repository.createQueryBuilder('movie');
        if (isAvailable) {
            queryBuilder.innerJoinAndSelect('movie.sessions', 'session');
        } else {
            queryBuilder.leftJoinAndSelect('movie.sessions', 'session');
        }
        if (filters) {
            Object.keys(filters).forEach((key) => {
                queryBuilder.andWhere(`movie."${key}" = :${key}`, {
                    [key]: filters[key as keyof Movie],
                });
            });
        }

        if (minAgeRestriction) {
            queryBuilder.andWhere(
                'movie.ageRestriction >= :minAgeRestriction',
                { minAgeRestriction },
            );
        }

        if (maxAgeRestriction) {
            queryBuilder.andWhere(
                'movie.ageRestriction <= :maxAgeRestriction',
                { maxAgeRestriction },
            );
        }

        if (sortField) {
            queryBuilder.orderBy(`movie."${sortField}"`, sortOrder);
        }

        return await queryBuilder.getMany();
    }
}
