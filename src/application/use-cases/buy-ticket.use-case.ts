import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import TicketRepositoryImpl from '../../domain/repositories/ticket.repository';
import UserRepositoryImpl from '../../domain/repositories/user.repository.impl';
import MovieSessionRepositoryImpl from '../../domain/repositories/movie-session.repository.impl';
import { BuyTicketDto } from '../dtos/buy-ticket.dto';
import TicketMapper from '../../domain/mappers/ticket.mapper';

@Injectable()
export default class BuyTicketUseCase {
    constructor(
        private readonly ticketRepository: TicketRepositoryImpl,
        private readonly movieSessionRepository: MovieSessionRepositoryImpl,
        private readonly userRepository: UserRepositoryImpl,
    ) {}
    async execute(buyTicket: BuyTicketDto): Promise<void> {
        const [session, user] = await Promise.all([
            this.movieSessionRepository.findByIdWithMovie(buyTicket.sessionId),
            this.userRepository.findById(buyTicket.userId),
        ]);
        if (!session) {
            throw new NotFoundException('Movie Session not found');
        }
        if (session.movie.ageRestriction > user.age) {
            throw new ForbiddenException(
                'User is not allowed to watch this movie',
            );
        }
        await this.ticketRepository.save(
            TicketMapper.fromBuyTicketDto(buyTicket),
        );
    }
}
