import { Test, TestingModule } from '@nestjs/testing';
import { AddMovieDto } from '../../src/application/dtos/add-movie.dto';
import AddMovieUseCase from '../../src/application/use-cases/add-movie.use-case';
import MovieMapper from '../../src/domain/mappers/movie.mapper';
import MovieRepositoryImpl from '../../src/domain/repositories/movie.repository.impl';
import RoomService from '../../src/domain/services/room.service';
import DbErrorCode from '../../src/shared/enums/db-error-code.enum';
import TimeSlot from '../../src/shared/enums/time-slots.enum';
import Movie from '../../src/domain/entities/movie.entity';
import NotAvailableTimeForMovieSessionException from '../../src/shared/exceptions/not-available-time-for-movie-session.exception';

describe('AddMovieUseCase', () => {
    let useCase: AddMovieUseCase;
    let movieRepository: MovieRepositoryImpl;
    let roomService: RoomService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AddMovieUseCase,
                {
                    provide: MovieRepositoryImpl,
                    useValue: {
                        save: jest.fn(),
                    },
                },
                {
                    provide: RoomService,
                    useValue: {
                        checkIfRoomsExistOrThrow: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get<AddMovieUseCase>(AddMovieUseCase);
        movieRepository = module.get<MovieRepositoryImpl>(MovieRepositoryImpl);
        roomService = module.get<RoomService>(RoomService);
    });

    it('should filter out duplicate sessions', async () => {
        const addMovieDto = {
            sessions: [
                { date: '2023-01-01', time: TimeSlot.FIRST, roomNumber: 1 },
                { date: '2023-01-01', time: TimeSlot.FIRST, roomNumber: 1 },
            ],
        } as AddMovieDto;
        const userId = 'user1';
        jest.spyOn(roomService, 'checkIfRoomsExistOrThrow').mockResolvedValue(
            true,
        );
        jest.spyOn(movieRepository, 'save').mockResolvedValue({} as Movie);

        await useCase.execute(addMovieDto, userId);

        expect(addMovieDto.sessions.length).toBe(1);
    });

    it('should check if rooms exist', async () => {
        const addMovieDto: AddMovieDto = {
            sessions: [
                { date: '2023-01-01', time: TimeSlot.FIRST, roomNumber: 1 },
            ],
        } as AddMovieDto;
        const userId = 'user1';
        jest.spyOn(roomService, 'checkIfRoomsExistOrThrow').mockResolvedValue(
            true,
        );
        jest.spyOn(movieRepository, 'save').mockResolvedValue({} as Movie);

        await useCase.execute(addMovieDto, userId);

        expect(roomService.checkIfRoomsExistOrThrow).toHaveBeenCalledWith([1]);
    });

    it('should save the movie', async () => {
        const addMovieDto: AddMovieDto = {
            sessions: [
                { date: '2023-01-01', time: TimeSlot.FIRST, roomNumber: 1 },
            ],
        } as AddMovieDto;
        const userId = 'user1';
        const movieEntity = {} as Movie;
        jest.spyOn(roomService, 'checkIfRoomsExistOrThrow').mockResolvedValue(
            true,
        );
        jest.spyOn(movieRepository, 'save').mockResolvedValue(movieEntity);
        jest.spyOn(MovieMapper, 'fromAddMovieDto').mockReturnValue(movieEntity);

        const result = await useCase.execute(addMovieDto, userId);

        expect(movieRepository.save).toHaveBeenCalledWith(movieEntity);
        expect(result).toBe(movieEntity);
    });

    it('should handle unique constraint violation', async () => {
        const addMovieDto: AddMovieDto = {
            sessions: [
                { date: '2023-01-01', time: TimeSlot.FIRST, roomNumber: 1 },
            ],
        } as AddMovieDto;
        const userId = 'user1';
        const error = {
            code: DbErrorCode.UNIQUE_VIOLATION,
            detail: `()=(2023-01-01, ${TimeSlot.FIRST}, 1, null ) already`,
        };
        jest.spyOn(roomService, 'checkIfRoomsExistOrThrow').mockResolvedValue(
            true,
        );
        jest.spyOn(movieRepository, 'save').mockRejectedValue(error);

        await expect(useCase.execute(addMovieDto, userId)).rejects.toThrow(
            NotAvailableTimeForMovieSessionException,
        );
    });
});
