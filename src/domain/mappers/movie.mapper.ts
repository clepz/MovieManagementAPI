import { AddMovieDto } from '../../application/dtos/add-movie.dto';
import { ModifyMovieDto } from '../../application/dtos/modify-movie.dto';
import MovieSession from '../../domain/entities/movie-session.entity';
import Movie from '../../domain/entities/movie.entity';

export default class MovieMapper {
    static fromAddMovieDto(movieDto: AddMovieDto, userId: string): Movie {
        const movie = new Movie();
        movie.payload = { userId };
        movie.title = movieDto.title;
        movie.description = movieDto.description;
        movie.ageRestriction = movieDto.ageRestriction;
        movie.sessions = movieDto.sessions?.map((session) => {
            const movieSession = new MovieSession();
            movieSession.date = session.date;
            movieSession.time = session.time;
            movieSession.roomNumber = session.roomNumber;
            movieSession.payload = { userId };
            return movieSession;
        });
        return movie;
    }

    static fromModifyMovieDto(
        modifiedMovie: ModifyMovieDto,
        userId: string,
    ): Movie {
        const movie = new Movie();
        movie.payload = { userId };
        movie.title = modifiedMovie.title;
        movie.description = modifiedMovie.description;
        movie.ageRestriction = modifiedMovie.ageRestriction;
        return movie;
    }
}
