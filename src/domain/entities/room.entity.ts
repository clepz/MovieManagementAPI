import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import BaseEntityModel from './base-entity-model';
import MovieSession from './movie-session.entity';

@Entity()
export default class Room extends BaseEntityModel {
    @PrimaryColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ nullable: true })
    title: string;

    @OneToMany(() => MovieSession, (session) => session.room)
    sessions: MovieSession[];
}
