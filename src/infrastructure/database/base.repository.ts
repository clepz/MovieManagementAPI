import {
    DeleteResult,
    FindOptionsWhere,
    ObjectLiteral,
    Repository,
    UpdateResult,
} from 'typeorm';
import BaseEntityModel from '../../domain/entities/base-entity-model';

export default abstract class BaseRepository<T extends BaseEntityModel> {
    protected abstract readonly repository: Repository<T>;
    /**
     * Prefered to use save because of relation and cascade. https://typeorm.io/repository-api
     * assuming the parameter won't have id. If it has id, use create method
     * @param entity
     * @returns
     */
    async save(entity: T): Promise<T> {
        if (entity.id) {
            throw new Error(
                'Use update method to update or insert method to insert using an id',
            );
        }
        return this.repository.save(entity);
    }
    async updateById(id: string, entity: Partial<T>): Promise<UpdateResult> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.repository.update(id, entity as any); // this is a known type issue in typeorm https://github.com/typeorm/typeorm/issues/2904
    }

    // removing entity from the database can be dangerous. So each repository should expose this method manually
    protected async delete(id: string | number): Promise<DeleteResult> {
        return await this.repository.delete(id);
    }

    // removing entity from the database can be dangerous. So each repository should expose this method manually
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
