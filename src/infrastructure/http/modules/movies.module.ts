import { Module } from '@nestjs/common';
import { MoviesController } from '../controllers/movie.controller';
import AddMovieUseCase from '../../../application/use-cases/add-movie.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import Movie from '../../../domain/entities/movie.entity';
import Room from '../../../domain/entities/room.entity';
import DeleteMovieUseCase from '../../../application/use-cases/delete-movie.use-case';
import RoomService from '../../../domain/services/room.service';
import MovieService from '../../../domain/services/movie.service';
import AddMovieBulkUseCase from '../../../application/use-cases/add-movie-bulk.use-case';
import { MovieSessionController } from '../controllers/movie-session.controller';
import MovieRepositoryImpl from '../../../domain/repositories/movie.repository.impl';
import RoomRepositoryImpl from '../../../domain/repositories/room.repository.impl';
import MovieSessionRepositoryImpl from '../../../domain/repositories/movie-session.repository.impl';
import MovieSessionService from '../../../domain/services/movie-session.service';
import MovieSession from '../../../domain/entities/movie-session.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Movie, Room, MovieSession])],
    controllers: [MoviesController, MovieSessionController],
    providers: [
        MovieRepositoryImpl,
        RoomRepositoryImpl,
        MovieSessionRepositoryImpl,
        AddMovieUseCase,
        AddMovieBulkUseCase,
        DeleteMovieUseCase,
        RoomService,
        MovieService,
        MovieSessionService,
    ],
})
export class MoviesModule {}
