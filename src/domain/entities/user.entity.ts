import { Column, Entity, Generated, OneToMany, PrimaryColumn } from 'typeorm';
import BaseEntityModel from './base-entity-model';
import ROLE from '../../shared/enums/role.enum';
import Ticket from './ticket.entity';

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

    @OneToMany(() => Ticket, (ticket) => ticket.session)
    tickets: Ticket[];
}
