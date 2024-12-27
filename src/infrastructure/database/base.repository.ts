import { FindOptionsWhere, Repository } from 'typeorm';
import BaseEntityModel from '../../domain/entities/base-entity-model';

export default abstract class BaseRepository<T extends BaseEntityModel> {
    constructor(private readonly repository: Repository<T>) {}
    async save(entity: T): Promise<T> {
        return this.repository.save(entity);
    }
    async update(entity: T): Promise<T> {
        return this.repository.save(entity);
    }
    async delete(id: string | number): Promise<void> {
        await this.repository.delete(id);
    }
    async findById(id: string | number): Promise<T> {
        return this.repository.findOneBy({ id } as FindOptionsWhere<T>);
    }
    async findOneBy(where: FindOptionsWhere<T>): Promise<T> {
        return this.repository.findOneBy(where);
    }
}
