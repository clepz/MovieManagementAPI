import { Injectable, NotFoundException } from '@nestjs/common';
import { MovieSessionDto } from '../../application/dtos/add-movie.dto';
import { ModifyMovieSessionDto } from '../../application/dtos/modify-movie-session.dto';
import MovieSessionRepositoryImpl from '../repositories/movie-session.repository.impl';
import MovieSessionMapper from '../mappers/movie-session.mapper';
import RoomService from './room.service';
import MovieSession from '../entities/movie-session.entity';
import movieSessionUniqueViolationMessageExtractAndThrow from '../../shared/utils/db-error-conflict-message-extract';
import DbErrorCode from '../../shared/enums/db-error-code.enum';

@Injectable()
export default class MovieSessionService {
    constructor(
        private readonly movieSessionRepository: MovieSessionRepositoryImpl,
        private readonly roomService: RoomService,
    ) {}
    async addSession(
        movieId: string,
        movieSession: MovieSessionDto,
        userId: string,
    ) {
        await this.roomService.checkIfRoomsExistOrThrow([
            movieSession.roomNumber,
        ]);

        try {
            await this.movieSessionRepository.save(
                MovieSessionMapper.fromMovieSessionDto(
                    movieId,
                    movieSession,
                    userId,
                ),
            );
        } catch (error) {
            if (error.code === DbErrorCode.UNIQUE_VIOLATION) {
                movieSessionUniqueViolationMessageExtractAndThrow(error);
            }
            throw error;
        }
    }
    async removeSession(id: string, movieId: string, userId: string) {
        return this.movieSessionRepository.removeMovieSession(
            id,
            movieId,
            userId,
        );
    }
    async modifySession(
        id: string,
        movieId: string,
        modifiedMovieSession: ModifyMovieSessionDto,
        userId: string,
    ) {
        const promises = [
            this.movieSessionRepository.findByIdWithMovie(id, movieId),
        ] as Array<Promise<MovieSession | boolean>>;
        if (modifiedMovieSession.roomNumber) {
            promises.push(
                this.roomService.checkIfRoomsExistOrThrow([
                    modifiedMovieSession.roomNumber,
                ]),
            );
        }
        const [session] = await Promise.all(promises);
        if (!session) {
            throw new NotFoundException('Movie session not found');
        }

        try {
            const ret = await this.movieSessionRepository.updateById(
                id,
                MovieSessionMapper.fromModifiedMovieSessionDto(
                    modifiedMovieSession,
                    userId,
                ),
            );
            if (!ret) {
                throw new NotFoundException('Movie session not found');
            }
            return true;
        } catch (error) {
            if (error.code === DbErrorCode.UNIQUE_VIOLATION) {
                movieSessionUniqueViolationMessageExtractAndThrow(error);
            }
            throw error;
        }
    }
}
