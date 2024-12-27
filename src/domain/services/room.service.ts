import { Injectable } from '@nestjs/common';
import RoomRepositoryImpl from '../../infrastructure/database/room.repository.impl';

@Injectable()
export default class RoomService {
    constructor(private readonly roomRepository: RoomRepositoryImpl) {}

    async getExistingRooms(roomNumbers: number[]): Promise<number[]> {
        return await this.roomRepository.getExistingRooms(roomNumbers);
    }
}
