import { BuyTicketDto } from '../../application/dtos/buy-ticket.dto';
import Ticket from '../entities/ticket.entity';

export default class TicketMapper {
    static fromBuyTicketDto(buyTicketDto: BuyTicketDto): Ticket {
        const ticket = new Ticket();
        ticket.sessionId = buyTicketDto.sessionId;
        ticket.userId = buyTicketDto.userId;
        ticket.payload = { userId: buyTicketDto.userId };
        return ticket;
    }
}
