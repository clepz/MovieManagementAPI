import { Injectable } from '@nestjs/common';
import BaseRepository from './base.repository';
import User from '../../domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export default class UserRepositoryImpl extends BaseRepository<User> {
    constructor(
        @InjectRepository(User)
        private readonly _repository: Repository<User>,
    ) {
        super(_repository);
    }
}
