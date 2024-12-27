import { HttpException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import SignInDto from '../../application/dtos/sign-in.dto';
import { TokenService } from './token.service';
import { comparePassword } from '../../shared/utils/hash-password.util';
import UserRepositoryImpl from '../database/user.repository.impl';
import UserMapper from '../../application/mappers/user.mapper';

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
            throw new HttpException('Invalid username or password', 400);
        }
        return user;
    }

    async signIn(body: SignInDto) {
        const user = await this.validateUserByPassword(body);
        if (!user) {
            throw new HttpException('Invalid username or password', 400);
        }
        return this.tokenService.generateToken(user.id);
    }
}
