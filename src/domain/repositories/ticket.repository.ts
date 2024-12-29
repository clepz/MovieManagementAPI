import { Injectable } from '@nestjs/common';
import BaseRepository from './base.repository';
import Ticket from '../entities/ticket.entity';
import { Repository } from 'typeorm';
import EntityStatus from '../../shared/enums/entity-status.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export default class TicketRepositoryImpl extends BaseRepository<Ticket> {
    constructor(
        @InjectRepository(Ticket)
        protected readonly repository: Repository<Ticket>,
    ) {
        super();
    }

    getAllTickets(userId: string, status?: EntityStatus) {
        return this.repository.find({
            where: {
                userId,
                status,
            },
            relations: {
                session: {
                    movie: true,
                },
            },
        });
    }
}
