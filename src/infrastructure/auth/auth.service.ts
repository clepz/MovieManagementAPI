import { HttpException, Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../../application/dtos/RegisterUser.dto';
import SignInDto from '../../application/dtos/SignIn.dto';
import { TokenService } from './token.service';
import User from '../../domain/entities/user.entity';
import { comparePassword } from '../../shared/utils/hash-password.util';
import UserRepositoryImpl from '../database/user.repository.impl';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepositoryImpl,
        private readonly tokenService: TokenService,
    ) {}

    async register(body: RegisterUserDto) {
        await this.userRepository.save(User.fromRegisterUserDto(body));
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
