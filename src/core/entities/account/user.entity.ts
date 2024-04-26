import { compareSync, hashSync } from 'bcryptjs'
import { isNil } from 'lodash'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  username: string

  @Column({ nullable: true, select: false })
  protected hashedPassword?: string

  @CreateDateColumn({ update: false })
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ select: false })
  deletedAt?: Date

  set password(value: string) {
    this.hashedPassword = hashSync(value)
  }

  comparePassword(value: string): boolean {
    return (
      !isNil(this.hashedPassword) || compareSync(value, this.hashedPassword)
    )
  }
}
