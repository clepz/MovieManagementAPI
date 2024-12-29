import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import WatchMovieUseCase from '../../src/application/use-cases/watch-movie.use-case';
import TicketRepositoryImpl from '../../src/domain/repositories/ticket.repository';
import EntityStatus from '../../src/shared/enums/entity-status.enum';
import Ticket from '../../src/domain/entities/ticket.entity';

describe('WatchMovieUseCase', () => {
    let useCase: WatchMovieUseCase;
    let ticketRepository: TicketRepositoryImpl;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WatchMovieUseCase,
                {
                    provide: TicketRepositoryImpl,
                    useValue: {
                        findById: jest.fn(),
                        updateById: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get<WatchMovieUseCase>(WatchMovieUseCase);
        ticketRepository =
            module.get<TicketRepositoryImpl>(TicketRepositoryImpl);
    });

    it('should throw NotFoundException if ticket is not found', async () => {
        const ticketId = 'ticket1';
        const userId = 'user1';
        jest.spyOn(ticketRepository, 'findById').mockResolvedValue(null);

        await expect(useCase.execute(ticketId, userId)).rejects.toThrow(
            NotFoundException,
        );
    });

    it('should throw NotFoundException if ticket does not belong to user', async () => {
        const ticketId = 'ticket1';
        const userId = 'user1';
        const ticket = {
            userId: 'user2',
            status: EntityStatus.ACTIVE,
        } as Ticket;
        jest.spyOn(ticketRepository, 'findById').mockResolvedValue(ticket);

        await expect(useCase.execute(ticketId, userId)).rejects.toThrow(
            NotFoundException,
        );
    });

    it('should throw BadRequestException if ticket is already used', async () => {
        const ticketId = 'ticket1';
        const userId = 'user1';
        const ticket = { userId, status: EntityStatus.INACTIVE } as Ticket;
        jest.spyOn(ticketRepository, 'findById').mockResolvedValue(ticket);

        await expect(useCase.execute(ticketId, userId)).rejects.toThrow(
            BadRequestException,
        );
    });

    it('should update ticket status to INACTIVE if all conditions are met', async () => {
        const ticketId = 'ticket1';
        const userId = 'user1';
        const ticket = { userId, status: EntityStatus.ACTIVE } as Ticket;
        jest.spyOn(ticketRepository, 'findById').mockResolvedValue(ticket);
        jest.spyOn(ticketRepository, 'updateById').mockResolvedValue(undefined);

        await useCase.execute(ticketId, userId);

        expect(ticketRepository.updateById).toHaveBeenCalledWith(ticketId, {
            ...ticket,
            status: EntityStatus.INACTIVE,
            updatedBy: userId,
        });
    });
});
