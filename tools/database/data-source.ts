import { DataSource, DataSourceOptions } from 'typeorm'
import path from 'path'
import Joi from 'joi'
import fs from 'fs'

const MIGRATIONS_DIR = path.join(
    __dirname,
    '../../src/assets/database/migrations'
)

if (!fs.existsSync(MIGRATIONS_DIR)) {
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true })
}

const config = {
    type: 'postgres',
    host: Joi.attempt(
        process.env.DB_HOST,
        Joi.string().required(),
        'DB_HOST must be a valid string'
    ),
    port: Joi.attempt(
        process.env.DB_PORT,
        Joi.number().port().default(5432),
        'DB_PORT must be a valid port number'
    ),

    username: Joi.attempt(
        process.env.DB_USERNAME,
        Joi.string().required(),
        'DB_USERNAME must be a valid string'
    ),
    password: Joi.attempt(
        process.env.DB_PASSWORD,
        Joi.string().required(),
        'DB_PASSWORD must be a valid string'
    ),
    name: Joi.attempt(
        process.env.DB_NAME,
        Joi.string().required(),
        'DB_NAME must be a valid string'
    ),
    entities: [
        path.join(__dirname, '../../src/**/*.entity{.ts,.js}'),
        path.join(__dirname, '../../src/**/*.view-entity{.ts,.js}')
    ],
    subscribers: [path.join(__dirname, '../../src/**/*.subscriber{.ts,.js}')],
    synchronize: Joi.attempt(
        process.env.DB_SYNCHRONIZE,
        Joi.boolean().default(false),
        'DB_SYNCHRONIZE must be a valid boolean'
    ),
    dropSchema: Joi.attempt(
        process.env.DB_DROP_SCHEMA,
        Joi.boolean().default(false),
        'DB_DROP_SCHEMA must be a valid boolean'
    ),
    logging: Joi.attempt(
        process.env.DB_LOGGING,
        Joi.alternatives()
            .try(
                Joi.boolean(),
                Joi.array().items(
                    Joi.string().valid(
                        'error',
                        'warn',
                        'query',
                        'schema',
                        'info',
                        'log',
                        'migration'
                    )
                )
            )
            .default(['error', 'warn', 'schema', 'migration']),
        'DB_LOGGING must be a valid boolean or array of strings'
    ),
    logger: Joi.attempt(
        process.env.DB_LOGGER,
        Joi.string()
            .valid(
                'advanced-console',
                'simple-console',
                'file',
                'debug',
                'custom'
            )
            .default('advanced-console'),
        'DB_LOGGER must be a valid string'
    ),
    migrationsRun: Joi.attempt(
        process.env.DB_MIGRATIONS_RUN,
        Joi.boolean().default(false),
        'DB_MIGRATIONS_RUN must be a valid boolean'
    ),
    migrations: [MIGRATIONS_DIR],
    migrationsTableName: Joi.attempt(
        process.env.DB_MIGRATIONS_TABLE_NAME,
        Joi.string().default('typeorm_migrations'),
        'DB_MIGRATIONS_TABLE_NAME must be a valid string'
    ),
    metadataTableName: Joi.attempt(
        process.env.DB_METADATA_TABLE_NAME,
        Joi.string().default('typeorm_metadata'),
        'DB_METADATA_TABLE_NAME must be a valid string'
    ),
    installExtensions: true,
    uuidExtension: 'uuid-ossp'
}

const dataSource = new DataSource({
    ...(config as DataSourceOptions)
})

export default dataSource
