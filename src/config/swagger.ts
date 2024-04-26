import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export function setupSwagger(app: INestApplication): INestApplication {
    const configService = app.get(ConfigService)

    const config = new DocumentBuilder()
        .setTitle(configService.getOrThrow('swagger.title'))
        .setDescription(configService.getOrThrow('swagger.description'))
        .setVersion(configService.getOrThrow('app.version'))
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        })
        .build()

    const swaggerDocument = SwaggerModule.createDocument(app, config, {
        include: [],
        ignoreGlobalPrefix: true,
        deepScanRoutes: true
    })

    SwaggerModule.setup(
        configService.getOrThrow('swagger.url'),
        app,
        swaggerDocument,
        configService.getOrThrow('swagger.swaggerOptions')
    )

    app.getHttpServer().once('listening', () => {
        const url =
            'http://localhost:' +
            app.getHttpServer().address().port +
            '/' +
            configService.getOrThrow('swagger.url')

        setTimeout(() => {
            console.log(`\n📚 Swagger: ${url}`)
        }, 1000)
    })

    return app
}
