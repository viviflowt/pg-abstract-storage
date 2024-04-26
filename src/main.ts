import { VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { useContainer } from 'class-validator'
import { AppModule } from './app.module'
import { setupSwagger } from './config/swagger'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log'],
        // logger: ['error', 'warn'],
        forceCloseConnections: true,
        bufferLogs: true
    })

    const configService = app.get(ConfigService)

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
        prefix: 'v'
    })

    useContainer(app.select(AppModule), { fallbackOnErrors: true })

    setupSwagger(app)

    // app.enableShutdownHooks()

    const port =
        process.env.PORT ||
        configService.get<number>('app.port', 3000, { infer: true })

    await app.listen(port, () => {
        //
    })
}
bootstrap()
