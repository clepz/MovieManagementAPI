import { OmitType } from '@nestjs/swagger';
import { GetTicketsResponseDto } from './get-tickets-response.dto';

export class BuyTicketResponseDto extends OmitType(GetTicketsResponseDto, [
    'session',
]) {}
