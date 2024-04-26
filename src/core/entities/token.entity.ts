import { BaseEntity, Column, Entity } from 'typeorm'

@Entity()
export class Token extends BaseEntity {
  @Column({ unique: true, update: false })
  token: string
}
