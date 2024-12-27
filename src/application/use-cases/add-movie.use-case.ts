import { Injectable } from '@nestjs/common';
import MovieRepositoryImpl from '../../infrastructure/database/movie.repository.impl';
import { AddMovieDto } from '../dtos/add-movie.dto';
import { MovieSessionVO } from '../../domain/value-objects/movie-session.vo';
import MovieMapper from '../mappers/movie.mapper';
import RoomsNotExistsException from '../../shared/exceptions/rooms-not-exists.exception';
import NotAvailableTimeForMovieSessionException from '../../shared/exceptions/not-available-time-for-movie-session.exception';

@Injectable()
export default class AddMovieUseCase {
    constructor(private readonly movieRepository: MovieRepositoryImpl) {}

    async execute(movie: AddMovieDto, userId: string) {
        const uniqueSessions = new Map<string, boolean>();
        const roomNumbersSet = new Set<number>();

        // remove duplicate sessions to avoid unique constraint violation
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
        //! no need to check existing sessions for conflict because the database will throw an error if there is a conflict -> unique constraint on date, time, and room number
        const notExistRooms = await this.movieRepository.roomsNotExists(
            Array.from(roomNumbersSet),
        );
        if (notExistRooms.length) {
            throw new RoomsNotExistsException(notExistRooms);
        }
        const movieEntity = MovieMapper.fromAddMovieDto(movie, userId);

        try {
            await this.movieRepository.save(movieEntity);
        } catch (error) {
            if (error.code === '23505') {
                const timeDetailMessage = error.detail.match(
                    /=\((.*?)\) already/,
                )[1] as string;
                throw new NotAvailableTimeForMovieSessionException(
                    timeDetailMessage,
                );
            }
            throw error;
        }

        return;
    }
}
