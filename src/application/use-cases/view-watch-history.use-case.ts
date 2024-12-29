import { Injectable } from '@nestjs/common';
import TicketRepositoryImpl from '../../domain/repositories/ticket.repository';
import EntityStatus from '../../shared/enums/entity-status.enum';
import { GetTicketsResponseDto } from '../dtos/response/get-tickets-response.dto';

@Injectable()
export default class ViewWatchHistoryUseCase {
    constructor(private readonly ticketRepository: TicketRepositoryImpl) {}
    async execute(
        userId: string,
        status?: EntityStatus,
    ): Promise<GetTicketsResponseDto[]> {
        return this.ticketRepository.getAllTickets(userId, status);
    }
}
