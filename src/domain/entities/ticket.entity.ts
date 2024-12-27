import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import BaseEntityModel from './base-entity-model';
import MovieSession from './movie-session.entity';
import User from './user.entity';

@Entity()
export default class Ticket extends BaseEntityModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => MovieSession, (session) => session.tickets)
    @JoinColumn({ name: 'sessionId' })
    session: MovieSession;

    @Column()
    sessionId: string;

    @ManyToOne(() => User, (user) => user.tickets)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;
}
