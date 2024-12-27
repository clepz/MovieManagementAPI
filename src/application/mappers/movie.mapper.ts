import MovieSession from '../../domain/entities/movie-session.entity';
import Movie from '../../domain/entities/movie.entity';
import { AddMovieDto } from '../dtos/add-movie.dto';

export default class MovieMapper {
    static fromAddMovieDto(movieDto: AddMovieDto, userId: string): Movie {
        const movie = new Movie();
        movie.payload = { userId };
        movie.title = movieDto.title;
        movie.description = movieDto.description;
        movie.ageRestriction = movieDto.ageRestriction;
        movie.sessions = movieDto.sessions.map((session) => {
            const movieSession = new MovieSession();
            movieSession.date = session.date;
            movieSession.time = session.time;
            movieSession.roomNumber = session.roomNumber;
            movieSession.payload = { userId };
            return movieSession;
        });
        return movie;
    }
}
