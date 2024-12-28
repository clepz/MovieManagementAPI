import {
    BeforeInsert,
    BeforeRecover,
    BeforeSoftRemove,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import BaseModel from './base-model';
import EntityStatus from '../../shared/enums/entity-status.enum';

export default abstract class BaseEntityModel extends BaseModel {
    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
    @DeleteDateColumn({ type: 'timestamp with time zone' })
    deletedAt: Date;
    @Column({ nullable: true })
    createdBy: string;
    @Column({ nullable: true })
    updatedBy: string;
    @VersionColumn({ default: 1 })
    version: number;
    @Column('int', { default: 1 })
    status: EntityStatus;

    @BeforeSoftRemove()
    beforeRemove() {
        this.status = EntityStatus.DELETED;
        this.updatedBy = this.payload?.userId;
    }

    @BeforeRecover()
    beforeRecover() {
        this.status = EntityStatus.ACTIVE;
        this.updatedBy = this.payload?.userId;
    }

    @BeforeInsert()
    beforeInsert() {
        this.createdBy = this.payload?.userId; // payload can be null if the api is public
    }

    @BeforeUpdate()
    beforeUpdate() {
        this.updatedBy = this.payload?.userId; // payload can be null if the api is public
        delete this.payload;
    }
}
