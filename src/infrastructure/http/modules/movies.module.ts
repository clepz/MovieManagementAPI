import { Module } from '@nestjs/common';
import { MoviesController } from '../controllers/movie.controller';
import MovieRepositoryImpl from '../../database/movie.repository.impl';
import AddMovieUseCase from '../../../application/use-cases/add-movie.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import Movie from '../../../domain/entities/movie.entity';
import Room from '../../../domain/entities/room.entity';
import DeleteMovieUseCase from '../../../application/use-cases/delete-movie.use-case';
import RoomRepositoryImpl from '../../database/room.repository.impl';
import RoomService from '../../../domain/services/room.service';

@Module({
    imports: [TypeOrmModule.forFeature([Movie, Room])],
    controllers: [MoviesController],
    providers: [
        MovieRepositoryImpl,
        RoomRepositoryImpl,
        AddMovieUseCase,
        DeleteMovieUseCase,
        RoomService,
    ],
})
export class MoviesModule {}
