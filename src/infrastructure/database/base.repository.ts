import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import BaseEntityModel from '../../domain/entities/base-entity-model';

export default abstract class BaseRepository<T extends BaseEntityModel> {
    protected abstract readonly repository: Repository<T>;
    async save(entity: T): Promise<T> {
        // I prefer to use save because of relation and cascade. https://typeorm.io/repository-api
        // standard function can be used according to the requirement
        return this.repository.save(entity);
    }
    async update(entity: T): Promise<T> {
        // I prefer to use save because of relation and cascade. https://typeorm.io/repository-api
        // standard function can be used according to the requirement
        return this.repository.save(entity);
    }

    // removing entity from the database can be dangerous. So each repository should override or implement this method
    protected async delete(id: string | number): Promise<DeleteResult> {
        return await this.repository.delete(id);
    }

    // removing entity from the database can be dangerous. So each repository should override or implement this method
    protected async softRemove(
        id: string | number,
        relations: string[],
    ): Promise<boolean> {
        const entity = await this.repository.find({
            where: { id } as FindOptionsWhere<T>,
            relations,
        });
        return (await this.repository.softRemove(entity)).length > 0;
    }

    async findById(id: string | number): Promise<T> {
        return this.repository.findOneBy({ id } as FindOptionsWhere<T>);
    }
    async findOneBy(where: FindOptionsWhere<T>): Promise<T> {
        return this.repository.findOneBy(where);
    }
}
