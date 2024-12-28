import { TicketStatusDto } from '../../application/dtos/get-tickets-query.dto';
import ApiCustomSwaggerDoc from '../interfaces/api-custom-swagger-doc.interface';

export const BuyTicketSwagger: ApiCustomSwaggerDoc = {
    POST: {
        operation: {
            summary:
                'Buy a ticket for a movie session. Assuming every ticket purchase for the user itself.',
        },
    },
};

export const GetTicketsSwagger: ApiCustomSwaggerDoc = {
    GET: {
        operation: {
            summary: 'Get tickets for the current user. (Watch history)',
            description:
                'The tickets are fetched based on the status. If status is not provided, all tickets will be fetched.\n Send inactive to get watch history',
        },
        query: {
            name: 'status',
            required: false,
            enum: TicketStatusDto,
            description:
                'Status can be ACTIVE (1) or INACTIVE (3). Active means the ticket is still valid and inactive means the ticket is used',
        },
    },
};

export const UseTicketSwagger: ApiCustomSwaggerDoc = {
    PATCH: {
        operation: {
            summary: 'Use a ticket to watch a movie',
        },
    },
};
