import Joi from 'joi'

export const config = {
    app: {
        env: Joi.attempt(
            process.env.NODE_ENV,
            Joi.string()
                .valid('development', 'production', 'test')
                .default('development'),
            'NODE_ENV must be one of "development", "test", or "production"'
        ),
        name: Joi.attempt(
            process.env.npm_package_name,
            Joi.string().default('NestJS API'),
            'APP_NAME must be a valid string'
        ),
        version: Joi.attempt(
            process.env.npm_package_version,
            Joi.string().default('0.0.0'),
            'npm_package_version must be a valid semver version string'
        ),
        port: Joi.attempt(
            process.env.PORT,
            Joi.number().port().default(3000),
            'PORT must be a valid port number'
        )
    },
    session: {
        secret: Joi.attempt(
            process.env.SESSION_SECRET,
            Joi.string().required(),
            'SESSION_SECRET must be a valid string'
        )
    },
    swagger: {
        title: Joi.attempt(
            process.env.SWAGGER_TITLE,
            Joi.string().default('Sandbox'),
            'SWAGGER_TITLE must be a valid string'
        ),
        description: Joi.attempt(
            process.env.SWAGGER_DESCRIPTION,
            Joi.string().default('API documentation'),
            'SWAGGER_DESCRIPTION must be a valid string'
        ),

        url: Joi.attempt(
            process.env.SWAGGER_URL,
            Joi.string().default('api-docs'),
            'SWAGGER_PATH must be a valid string'
        ),
        jsonDocumentUrl: Joi.attempt(
            process.env.SWAGGER_JSON_DOCUMENT_URL,
            Joi.string().default('api-json'),
            'SWAGGER_JSON_DOCUMENT_URL must be a valid string'
        ),
        yamlDocumentUrl: Joi.attempt(
            process.env.SWAGGER_YAML_DOCUMENT_URL,
            Joi.string().default('api-yaml'),
            'SWAGGER_YAML_DOCUMENT_URL must be a valid string'
        ),
        swaggerOptions: {
            persistAuthorization: Joi.attempt(
                process.env.SWAGGER_PERSIST_AUTHORIZATION,
                Joi.boolean().default(true),
                'SWAGGER_PERSIST_AUTHORIZATION must be a boolean'
            ),
            docExpansion: Joi.attempt(
                process.env.SWAGGER_DOC_EXPANSION,
                Joi.string().valid('list', 'full', 'none').default('list'),
                'SWAGGER_DOC_EXPANSION must be one of "list", "full", or "none"'
            ),
            filter: Joi.attempt(
                process.env.SWAGGER_FILTER,
                Joi.boolean().default(true),
                'SWAGGER_FILTER must be a boolean'
            ),
            showRequestDuration: Joi.attempt(
                process.env.SWAGGER_SHOW_REQUEST_DURATION,
                Joi.boolean().default(true),
                'SWAGGER_SHOW_REQUEST_DURATION must be a boolean'
            ),
            operationsSorter: Joi.attempt(
                process.env.SWAGGER_OPERATIONS_SORTER,
                Joi.string().valid('alpha', 'method').default('alpha'),
                'SWAGGER_OPERATIONS_SORTER must be one of "alpha" or "method"'
            ),
            tagsSorter: Joi.attempt(
                process.env.SWAGGER_TAGS_SORTER,
                Joi.string().valid('alpha', 'none').default('alpha'),
                'SWAGGER_TAGS_SORTER must be one of "alpha" or "none"'
            ),
            displayOperationId: Joi.attempt(
                process.env.SWAGGER_DISPLAY_OPERATION_ID,
                Joi.boolean().default(false),
                'SWAGGER_DISPLAY_OPERATION_ID must be a boolean'
            )
        }
    }
}
