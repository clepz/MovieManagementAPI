import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import SignInDto from '../../application/dtos/sign-in.dto';
import { TokenService } from './token.service';
import { comparePassword } from '../../shared/utils/hash-password.util';
import { TokensResponseDto } from '../../application/dtos/response/login-response.dto';
import UserRepositoryImpl from '../../domain/repositories/user.repository.impl';
import UserMapper from '../../domain/mappers/user.mapper';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepositoryImpl,
        private readonly tokenService: TokenService,
    ) {}

    async register(body: RegisterUserDto) {
        await this.userRepository.save(UserMapper.fromRegisterUserDto(body));
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
