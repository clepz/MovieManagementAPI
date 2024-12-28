import { MovieSessionDto } from '../../application/dtos/add-movie.dto';
import { ModifyMovieSessionDto } from '../../application/dtos/modify-movie-session.dto';
import MovieSession from '../entities/movie-session.entity';

export default class MovieSessionMapper {
    static fromMovieSessionDto(
        movieId: string,
        movieSession: MovieSessionDto,
        userId: string,
    ): MovieSession {
        const movieSessionEntity = new MovieSession();
        movieSessionEntity.date = movieSession.date;
        movieSessionEntity.time = movieSession.time;
        movieSessionEntity.roomNumber = movieSession.roomNumber;
        movieSessionEntity.movieId = movieId;
        movieSessionEntity.payload = { userId };
        return movieSessionEntity;
    }

    static fromModifiedMovieSessionDto(
        modifiedMovieSession: ModifyMovieSessionDto,
        userId: string,
    ): MovieSession {
        const movieSessionEntity = new MovieSession();
        movieSessionEntity.date = modifiedMovieSession.date;
        movieSessionEntity.time = modifiedMovieSession.time;
        movieSessionEntity.roomNumber = modifiedMovieSession.roomNumber;
        movieSessionEntity.payload = { userId };
        return movieSessionEntity;
    }
}
