import { HttpException, Injectable } from '@nestjs/common';
import User from 'src/models/user/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '../../dtos/RegisterUser.dto';
import SignInDto from '../../dtos/SignIn.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { comparePassword } from 'src/lib/utils/hash-password.util';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async register(body: RegisterUserDto) {
        await this.userRepository.save(User.fromRegisterUserDto(body));
    }

    async signIn(body: SignInDto) {
        const user = await this.userRepository.findOneBy({
            username: body.username,
        });
        if (!user || !(await comparePassword(body.password, user.password))) {
            throw new HttpException('Invalid username or password', 400);
        }
    }
}
