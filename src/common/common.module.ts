import { HealthModule } from '@/common/health'
import {
    Global,
    Inject,
    MiddlewareConsumer,
    Module,
    NestModule
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { CompressionMiddleware } from './middlewares/compression.middleware'
import { ConnectTimeoutMiddleware } from './middlewares/connect-timeout.middleware'
import { CookieParserMiddleware } from './middlewares/cookie-parser.middleware'
import { HelmetMiddleware } from './middlewares/helmet.middleware'
import { MorganMiddleware } from './middlewares/morgan.middleware'
import { ResponseTimeMiddleware } from './middlewares/response-time.middleware'

@Global()
@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                ...config.get<TypeOrmModuleOptions>('database')
            })
        }),
        HealthModule
    ],
    providers: [],
    exports: []
})
export class CommonModule implements NestModule {
    constructor(
        @Inject(ConfigService)
        private readonly configService: ConfigService
    ) {}

    configure(consumer: MiddlewareConsumer) {
        CompressionMiddleware.configure({ level: 9 })
        ConnectTimeoutMiddleware.configure('5s')
        CookieParserMiddleware.configure(
            this.configService.getOrThrow<string>('session.secret')
        )
        HelmetMiddleware.configure({
            hidePoweredBy: true
        })
        MorganMiddleware.configure('dev', {
            skip: (req) => {
                return [
                    this.configService.get<string>('health.url', 'health'),
                    this.configService.get<string>('swagger.url'),
                    this.configService.get<string>('swagger.jsonDocumentUrl'),
                    this.configService.get<string>('swagger.yamlDocumentUrl')
                ].includes(req.url)
            }
        })
        ResponseTimeMiddleware.configure({ digits: 3 })

        consumer
            .apply(
                CompressionMiddleware,
                ConnectTimeoutMiddleware,
                CookieParserMiddleware,
                HelmetMiddleware,
                MorganMiddleware,
                ResponseTimeMiddleware
            )
            .forRoutes('*')
    }
}
