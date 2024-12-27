import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import BaseRepository from './base.repository';
import Movie from '../../domain/entities/movie.entity';
import Room from '../../domain/entities/room.entity';

@Injectable()
export default class MovieRepositoryImpl extends BaseRepository<Movie> {
    constructor(
        @InjectRepository(Movie)
        protected readonly repository: Repository<Movie>,
        @InjectRepository(Room)
        private readonly _roomRepository: Repository<Room>,
    ) {
        super();
    }

    async roomsNotExists(roomNumbers: number[]): Promise<number[]> {
        const existingRoomIds = await this._roomRepository
            .find({
                where: { id: In(roomNumbers) },
                select: ['id'],
            })
            .then((rooms) => rooms.map((room) => room.id));

        return roomNumbers.filter(
            (roomNumber) => !existingRoomIds.includes(roomNumber),
        );
    }

    async removeMovie(id: string): Promise<boolean> {
        return await this.softRemove(id, ['sessions']);
    }
}
