import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../services/auth/auth.service';
import User from '../../../../models/user/user.entity';
import { TokenService } from '../../services/token/token.service';
import { ConfigService } from '@nestjs/config';
import { getMockRepositoryService } from '../../../../../test/utils/mock-repository.utils';

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                TokenService,
                ConfigService,
                getMockRepositoryService(User),
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
