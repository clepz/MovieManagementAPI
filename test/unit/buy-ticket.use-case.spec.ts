import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { v7 as uuid } from 'uuid';
import { BuyTicketDto } from '../../src/application/dtos/buy-ticket.dto';
import BuyTicketUseCase from '../../src/application/use-cases/buy-ticket.use-case';
import MovieSession from '../../src/domain/entities/movie-session.entity';
import Ticket from '../../src/domain/entities/ticket.entity';
import User from '../../src/domain/entities/user.entity';
import TicketMapper from '../../src/domain/mappers/ticket.mapper';
import MovieSessionRepositoryImpl from '../../src/domain/repositories/movie-session.repository.impl';
import TicketRepositoryImpl from '../../src/domain/repositories/ticket.repository';
import UserRepositoryImpl from '../../src/domain/repositories/user.repository.impl';

describe('BuyTicketUseCase', () => {
    let useCase: BuyTicketUseCase;
    let ticketRepository: TicketRepositoryImpl;
    let movieSessionRepository: MovieSessionRepositoryImpl;
    let userRepository: UserRepositoryImpl;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BuyTicketUseCase,
                {
                    provide: TicketRepositoryImpl,
                    useValue: {
                        save: jest.fn(),
                    },
                },
                {
                    provide: MovieSessionRepositoryImpl,
                    useValue: {
                        findByIdWithMovie: jest.fn(),
                    },
                },
                {
                    provide: UserRepositoryImpl,
                    useValue: {
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get<BuyTicketUseCase>(BuyTicketUseCase);
        ticketRepository =
            module.get<TicketRepositoryImpl>(TicketRepositoryImpl);
        movieSessionRepository = module.get<MovieSessionRepositoryImpl>(
            MovieSessionRepositoryImpl,
        );
        userRepository = module.get<UserRepositoryImpl>(UserRepositoryImpl);
    });

    it('should throw NotFoundException if movie session is not found', async () => {
        const buyTicketDto: BuyTicketDto = {
            sessionId: uuid(),
            userId: uuid(),
        };
        jest.spyOn(
            movieSessionRepository,
            'findByIdWithMovie',
        ).mockResolvedValue(null);
        jest.spyOn(userRepository, 'findById').mockResolvedValue({
            age: 20,
        } as User);

        await expect(useCase.execute(buyTicketDto)).rejects.toThrow(
            NotFoundException,
        );
    });

    it('should throw ForbiddenException if user is not allowed to watch the movie', async () => {
        const buyTicketDto: BuyTicketDto = {
            sessionId: uuid(),
            userId: uuid(),
        };
        jest.spyOn(
            movieSessionRepository,
            'findByIdWithMovie',
        ).mockResolvedValue({ movie: { ageRestriction: 18 } } as MovieSession);
        jest.spyOn(userRepository, 'findById').mockResolvedValue({
            age: 16,
        } as User);

        await expect(useCase.execute(buyTicketDto)).rejects.toThrow(
            ForbiddenException,
        );
    });

    it('should save the ticket if all conditions are met', async () => {
        const buyTicketDto: BuyTicketDto = {
            sessionId: uuid(),
            userId: uuid(),
        };
        const ticket = new Ticket();
        jest.spyOn(
            movieSessionRepository,
            'findByIdWithMovie',
        ).mockResolvedValue({ movie: { ageRestriction: 18 } } as MovieSession);
        jest.spyOn(userRepository, 'findById').mockResolvedValue({
            age: 20,
        } as User);
        jest.spyOn(ticketRepository, 'save').mockResolvedValue(ticket);
        jest.spyOn(TicketMapper, 'fromBuyTicketDto').mockReturnValue(ticket);

        expect(await useCase.execute(buyTicketDto)).toBe(ticket);
    });
});
