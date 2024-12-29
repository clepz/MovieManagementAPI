import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import BuyTicketUseCase from '../../../application/use-cases/buy-ticket.use-case';
import ViewWatchHistoryUseCase from '../../../application/use-cases/view-watch-history.use-case';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
} from '@nestjs/swagger';
import { BuyTicketDto } from '../../../application/dtos/buy-ticket.dto';
import { AddUserIdIntoBodyInterceptor } from '../interceptors/add-user-id-into-body.interceptor';
import {
    BuyTicketSwagger,
    GetTicketsSwagger,
    UseTicketSwagger,
} from '../../../shared/swagger/tickets.swagger';
import { plainToInstance } from 'class-transformer';
import { GetCurrentUserId } from '../decorators/get-current-user-id.decorator';
import { StatusQueryDto } from '../../../application/dtos/get-tickets-query.dto';
import { GetTicketsResponseDto } from '../../../application/dtos/response/get-tickets-response.dto';
import WatchMovieUseCase from '../../../application/use-cases/watch-movie.use-case';
import { BuyTicketResponseDto } from '../../../application/dtos/response/buy-ticket-response.dto';

@Controller('tickets')
export class TicketsController {
    constructor(
        private readonly buyTicketUseCase: BuyTicketUseCase,
        private readonly viewWatchHistoryUseCase: ViewWatchHistoryUseCase,
        private readonly watchMovieUseCase: WatchMovieUseCase,
    ) {}

    // assuming every ticket purchase for the user itself
    @ApiBearerAuth()
    @ApiOperation(BuyTicketSwagger.POST.operation)
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({
        status: 201,
        description: 'Ticket purchased successfully',
        type: BuyTicketResponseDto,
    })
    @ApiResponse({
        status: 403,
        description: 'User is not allowed to watch this movie',
    })
    @ApiResponse({ status: 404, description: 'Movie Session not found' })
    @Post('')
    @UseInterceptors(AddUserIdIntoBodyInterceptor)
    async buyTicket(
        @Body() buyTicketDto: BuyTicketDto,
    ): Promise<BuyTicketResponseDto> {
        const createdTicket = await this.buyTicketUseCase.execute(buyTicketDto);
        return plainToInstance(BuyTicketResponseDto, createdTicket);
    }

    @ApiBearerAuth()
    @ApiOperation(GetTicketsSwagger.GET.operation)
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({
        status: 200,
        description: 'Tickets fetched successfully',
        type: GetTicketsResponseDto,
    })
    @ApiQuery(GetTicketsSwagger.GET.query)
    @Get('')
    async getTickets(
        @GetCurrentUserId() userId: string,
        @Query(new ValidationPipe({ transform: true })) query: StatusQueryDto,
    ) {
        const { status } = query;
        const res = await this.viewWatchHistoryUseCase.execute(userId, status);
        return plainToInstance(GetTicketsResponseDto, res);
    }

    @ApiBearerAuth()
    @ApiOperation(UseTicketSwagger.PATCH.operation)
    @ApiParam({
        name: 'id',
        schema: { format: 'uuid' },
        description: 'Ticket ID',
    })
    @Patch(':id')
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({
        status: 200,
        description: 'Ticket used successfully',
    })
    @ApiResponse({ status: 404, description: 'Ticket not found' })
    async useTicket(
        @Param('id', ParseUUIDPipe) id: string,
        @GetCurrentUserId() userId: string,
    ) {
        await this.watchMovieUseCase.execute(id, userId);
    }
}
