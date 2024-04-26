import { compareSync, hashSync } from 'bcryptjs'
import { isNil } from 'lodash'
import { BaseEntity, Column, Entity } from 'typeorm'

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string

  @Column({ nullable: true, select: false })
  protected hashedPassword?: string

  set password(value: string) {
    this.hashedPassword = hashSync(value)
  }

  comparePassword(value: string): boolean {
    return (
      !isNil(this.hashedPassword) || compareSync(value, this.hashedPassword)
    )
  }
}
