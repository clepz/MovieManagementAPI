import { Injectable } from '@nestjs/common';
import RoomRepositoryImpl from '../repositories/room.repository.impl';
import RoomsNotExistsException from '../../shared/exceptions/rooms-not-exists.exception';

@Injectable()
export default class RoomService {
    constructor(private readonly roomRepository: RoomRepositoryImpl) {}

    async getExistingRooms(): Promise<number[]> {
        return await this.roomRepository.getExistingRooms();
    }

    async checkIfRoomsExistOrThrow(roomNumbers: number[]): Promise<boolean> {
        const existingRoomNumber = await this.getExistingRooms();
        const notExistRooms = roomNumbers.filter(
            (roomNumber) => !existingRoomNumber.includes(roomNumber),
        );
        if (notExistRooms.length) {
            throw new RoomsNotExistsException(notExistRooms);
        }
        return true;
    }
}
