import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    findUser() {
        return 'hello';
    }
}
