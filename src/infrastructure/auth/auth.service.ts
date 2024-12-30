import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import SignInDto from '../../application/dtos/sign-in.dto';
import { TokenService } from './token.service';
import { comparePassword } from '../../shared/utils/hash-password.util';
import { TokensResponseDto } from '../../application/dtos/response/login-response.dto';
import UserRepositoryImpl from '../../domain/repositories/user.repository.impl';
import UserMapper from '../../domain/mappers/user.mapper';
import { ConfigService } from '@nestjs/config';
import Role from '../../shared/enums/role.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepositoryImpl,
        private readonly tokenService: TokenService,
        private readonly config: ConfigService,
    ) {}

    async register(body: RegisterUserDto) {
        const user = UserMapper.fromRegisterUserDto(body);
        // For testing purposes, we can create a manager user
        if (
            this.config.get('NODE_ENV') === 'test' &&
            body.username.startsWith(Role.MANAGER)
        ) {
            user.role = Role.MANAGER;
        }
        const existingUser = await this.userRepository.findByUsername(
            body.username.toLowerCase(),
        );
        if (existingUser) {
            throw new BadRequestException('The username is already taken');
        }
        await this.userRepository.save(user);
    }

    async validateUserByPassword(body: SignInDto) {
        const user = await this.userRepository.findOneBy({
            username: body.username,
        });
        if (!user || !(await comparePassword(body.password, user.password))) {
            throw new BadRequestException('Invalid username or password');
        }
        return user;
    }

    async signIn(body: SignInDto): Promise<TokensResponseDto> {
        const user = await this.validateUserByPassword(body);
        if (!user) {
            throw new BadRequestException('Invalid username or password');
        }
        return this.tokenService.generateToken(user.id);
    }
}
