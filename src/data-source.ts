import 'reflect-metadata'
import dotenv from 'dotenv'
import { DataSource } from 'typeorm'
import path from 'path'

dotenv.config()

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    path.join(__dirname, 'core/entities/**/*.entity.ts'),
    path.join(__dirname, 'core/entities/**/*.view-entity.ts')
  ],
  subscribers: [path.join(__dirname, 'core/subscribers/**/*.subscriber.ts')],
  synchronize: true,
  logging: ['error', 'warn', 'query'],
  logger: 'advanced-console',
  installExtensions: true
})

export default dataSource
