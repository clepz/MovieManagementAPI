import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '../../dtos/RegisterUser.dto';
import SignInDto from '../../dtos/SignIn.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenService } from '../token/token.service';
import User from '../../../../models/user/user.entity';
import { comparePassword } from '../../../../lib/utils/hash-password.util';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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
