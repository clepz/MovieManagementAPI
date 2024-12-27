import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import BaseEntityModel from './base-entity-model';
import MovieSession from './movie-session.entity';

@Entity()
export default class Movie extends BaseEntityModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ unsigned: true })
    ageRestriction: number;

    @OneToMany(() => MovieSession, (session) => session.movie, {
        cascade: ['insert', 'soft-remove'],
    })
    sessions: MovieSession[];
}
