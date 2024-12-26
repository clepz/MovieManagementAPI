import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import User from '../../../../models/user/user.entity';
import { TokenService } from '../token/token.service';
import { ConfigService } from '@nestjs/config';
import { getMockRepositoryService } from '../../../../../test/utils/mock-repository.utils';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                TokenService,
                ConfigService,
                getMockRepositoryService(User),
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
