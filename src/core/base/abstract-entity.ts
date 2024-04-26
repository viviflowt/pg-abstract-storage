import {
    BaseEntity,
    BeforeInsert,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm'

import { createId } from '@paralleldrive/cuid2'

export abstract class AbstractEntity extends BaseEntity {
    @PrimaryColumn({ update: false, type: 'varchar' })
    id: string

    @CreateDateColumn({ update: false })
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn({ select: false })
    deletedAt?: Date

    @BeforeInsert()
    setId() {
        this.id = createId()
    }
}
