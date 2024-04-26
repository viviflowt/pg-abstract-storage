import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import { PUBLIC_RESOURCE } from '../common/constants'

function applySecurityForNonPublicEndpoints(document: OpenAPIObject) {
    const paths = document.paths
    const security = [{ bearer: [] }]

    for (const path in paths) {
        for (const method in paths[path]) {
            const pathMethod = paths[path][method]
            const tags = pathMethod.tags ?? []
            if (tags.includes(PUBLIC_RESOURCE)) {
                delete pathMethod.security
                document.paths[path][method].tags = document.paths[path][
                    method
                ].tags.filter((tag: string) => tag !== PUBLIC_RESOURCE)
            } else {
                document.paths[path][method].security = security
            }
        }
    }

    // fs.writeFileSync('swagger.json', JSON.stringify(document, null, 2))

    return document
}

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
        applySecurityForNonPublicEndpoints(swaggerDocument),
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
