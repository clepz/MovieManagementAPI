import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';
import BaseEntityModel from '../base-entity-model';
import { RegisterUserDto } from '../../modules/auth/dtos/RegisterUser.dto';
import ROLE from '../../lib/enums/role.enum';

@Entity()
export default class User extends BaseEntityModel {
    @PrimaryColumn('uuid')
    @Generated('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    name: string;

    @Column({ unsigned: true })
    age: number;

    @Column({ type: 'varchar', default: ROLE.customer })
    role: ROLE;

    static fromRegisterUserDto(body: RegisterUserDto) {
        const user = new User();
        user.username = body.username;
        user.password = body.password;
        user.age = body.age;
        return user;
    }
}
