import { Column, Entity } from 'typeorm'

import { AbstractEntity } from '../../base/abstract-entity'

@Entity()
export class Target extends AbstractEntity {
    @Column({})
    name: string
}
