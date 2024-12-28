import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import BaseEntityModel from './base-entity-model';
import Movie from './movie.entity';
import TimeSlot from '../../shared/enums/time-slots.enum';
import Room from './room.entity';
import Ticket from './ticket.entity';

@Entity()
@Unique('unique_movie_session_constraint', [
    'date',
    'time',
    'roomNumber',
    'deletedAt', // Soft delete column
])
export default class MovieSession extends BaseEntityModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('date')
    date: string;

    @Column('varchar', { length: 11 })
    time: TimeSlot;

    @Column()
    movieId: string;

    @ManyToOne(() => Movie, (movie) => movie.sessions)
    @JoinColumn({ name: 'movieId' })
    movie: Movie;

    @ManyToOne(() => Room, (room) => room.sessions)
    @JoinColumn({ name: 'roomNumber' })
    room: Room;

    @Column('int', { unsigned: true, nullable: false })
    roomNumber: number;

    @OneToMany(() => Ticket, (ticket) => ticket.session)
    tickets: Ticket[];
}
