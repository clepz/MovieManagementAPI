import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Ticket from '../../../domain/entities/ticket.entity';
import { TicketsController } from '../controllers/tickets.controller';
import BuyTicketUseCase from '../../../application/use-cases/buy-ticket.use-case';
import ViewWatchHistoryUseCase from '../../../application/use-cases/view-watch-history.use-case';
import MovieSession from '../../../domain/entities/movie-session.entity';
import MovieSessionRepositoryImpl from '../../../domain/repositories/movie-session.repository.impl';
import TicketRepositoryImpl from '../../../domain/repositories/ticket.repository';
import UserRepositoryImpl from '../../../domain/repositories/user.repository.impl';
import User from '../../../domain/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Ticket, MovieSession, User])],
    controllers: [TicketsController],
    providers: [
        BuyTicketUseCase,
        ViewWatchHistoryUseCase,
        MovieSessionRepositoryImpl,
        TicketRepositoryImpl,
        UserRepositoryImpl,
    ],
})
export class TicketsModule {}
