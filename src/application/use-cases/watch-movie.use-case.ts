import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import TicketRepositoryImpl from '../../domain/repositories/ticket.repository';
import EntityStatus from '../../shared/enums/entity-status.enum';

@Injectable()
export default class WatchMovieUseCase {
    constructor(private readonly ticketRepository: TicketRepositoryImpl) {}
    async execute(ticketId: string, userId: string): Promise<void> {
        const ticket = await this.ticketRepository.findById(ticketId);
        if (!ticket) {
            throw new NotFoundException('Ticket not found');
        }
        if (ticket.userId !== userId) {
            throw new NotFoundException('Ticket not found');
        }
        if (ticket.status === EntityStatus.INACTIVE) {
            throw new BadRequestException('Ticket is already used');
        }
        ticket.status = EntityStatus.INACTIVE;
        ticket.updatedBy = userId;
        await this.ticketRepository.updateById(ticketId, ticket);
    }
}
