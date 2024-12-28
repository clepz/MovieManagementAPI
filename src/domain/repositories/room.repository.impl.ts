import { Injectable } from '@nestjs/common';
import BaseRepository from './base.repository';
import Room from '../../domain/entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export default class RoomRepositoryImpl extends BaseRepository<Room> {
    constructor(
        @InjectRepository(Room)
        protected readonly repository: Repository<Room>,
    ) {
        super();
    }

    async getExistingRooms(): Promise<number[]> {
        return (await this.repository.find({ select: ['id'] })).map(
            (room) => room.id,
        );
    }
}
