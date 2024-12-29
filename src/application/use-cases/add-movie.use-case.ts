import { Injectable } from '@nestjs/common';
import { AddMovieDto } from '../dtos/add-movie.dto';
import { MovieSessionVO } from '../../domain/value-objects/movie-session.vo';
import RoomService from '../../domain/services/room.service';
import MovieRepositoryImpl from '../../domain/repositories/movie.repository.impl';
import MovieMapper from '../../domain/mappers/movie.mapper';
import movieSessionUniqueViolationMessageExtractAndThrow from '../../shared/utils/db-error-conflict-message-extract';
import DbErrorCode from '../../shared/enums/db-error-code.enum';

@Injectable()
export default class AddMovieUseCase {
    constructor(
        private readonly movieRepository: MovieRepositoryImpl,
        private readonly roomService: RoomService,
    ) {}

    async execute(movie: AddMovieDto, userId: string) {
        const uniqueSessions = new Map<string, boolean>();
        const roomNumbersSet = new Set<number>();

        // no need to check existing sessions for conflict because the database will throw an error if there is a conflict -> unique constraint on date, time, and room number
        // --- remove duplicate sessions to avoid unique constraint violation
        movie.sessions = movie.sessions.filter((session) => {
            roomNumbersSet.add(session.roomNumber);
            const sessionVO = new MovieSessionVO(
                session.date,
                session.time,
                session.roomNumber,
            );
            const key = sessionVO.toString();
            if (uniqueSessions.has(key)) {
                return false;
            }
            uniqueSessions.set(key, true);
            return true;
        });
        // -- check if rooms exist
        await this.roomService.checkIfRoomsExistOrThrow(
            Array.from(roomNumbersSet),
        );
        // -- save movie
        const movieEntity = MovieMapper.fromAddMovieDto(movie, userId);

        try {
            return await this.movieRepository.save(movieEntity);
        } catch (error) {
            if (error.code === DbErrorCode.UNIQUE_VIOLATION) {
                movieSessionUniqueViolationMessageExtractAndThrow(error);
            }
            throw error;
        }
    }
}
