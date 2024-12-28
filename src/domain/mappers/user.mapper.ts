import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import User from '../../domain/entities/user.entity';

export default class UserMapper {
    static fromRegisterUserDto(body: RegisterUserDto) {
        const user = new User();
        user.username = body.username;
        user.password = body.password;
        user.age = body.age;
        return user;
    }
}
