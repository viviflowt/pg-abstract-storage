import { ApiHideProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ default: true })
  @ApiHideProperty()
  @Exclude()
  isActive: boolean

  // @Column({ default: false })
  // isArchived: boolean

  @CreateDateColumn({ update: false })
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  @ApiHideProperty()
  @Exclude()
  deletedAt?: Date
}
