import { Test, TestingModule } from '@nestjs/testing';
import RoomRepositoryImpl from '../../src/domain/repositories/room.repository.impl';
import RoomService from '../../src/domain/services/room.service';
import RoomsNotExistsException from '../../src/shared/exceptions/rooms-not-exists.exception';

describe('RoomService', () => {
    let service: RoomService;
    let roomRepository: RoomRepositoryImpl;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoomService,
                {
                    provide: RoomRepositoryImpl,
                    useValue: {
                        getExistingRooms: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<RoomService>(RoomService);
        roomRepository = module.get<RoomRepositoryImpl>(RoomRepositoryImpl);
    });

    it('should return true if all rooms exist', async () => {
        const roomNumbers = [1, 2, 3];
        jest.spyOn(roomRepository, 'getExistingRooms').mockResolvedValue([
            1, 2, 3,
        ]);

        expect(await service.checkIfRoomsExistOrThrow(roomNumbers)).toBe(true);
    });

    it('should throw RoomsNotExistsException if some rooms do not exist', async () => {
        const roomNumbers = [1, 2, 4];
        jest.spyOn(roomRepository, 'getExistingRooms').mockResolvedValue([
            1, 2, 3,
        ]);

        await expect(
            service.checkIfRoomsExistOrThrow(roomNumbers),
        ).rejects.toThrow(new RoomsNotExistsException([4]));
    });
});
