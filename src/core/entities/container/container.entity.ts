import { Column, Entity } from 'typeorm'

import { AbstractEntity } from '../../base/abstract-entity'

@Entity()
export class Container extends AbstractEntity {
    @Column({})
    name: string
}
