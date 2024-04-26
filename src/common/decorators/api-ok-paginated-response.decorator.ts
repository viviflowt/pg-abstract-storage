import { HttpCode, HttpStatus, Type, applyDecorators } from '@nestjs/common'
import {
    ApiExtraModels,
    ApiProperty,
    ApiResponse,
    getSchemaPath
} from '@nestjs/swagger'
import {
    ReferenceObject,
    SchemaObject
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { Exclude, Expose } from 'class-transformer'
import { Allow } from 'class-validator'

export const DEFAULT_PAGE_SIZE = parseInt(process.env.DEFAULT_PAGE_SIZE) || 10
export const MAX_PAGE_SIZE = parseInt(process.env.MAX_PAGE_SIZE) || 100

const DEFAULT_DESCRIPTION =
    'Return a paginated set of items based in query params criteria.'

@Exclude()
export class PaginatedResponse<T> {
    @ApiProperty({
        isArray: true,
        type: Object
    })
    @Allow()
    @Expose()
    data: T[]

    @ApiProperty({
        type: Number
    })
    @Allow()
    @Expose()
    page: number

    @ApiProperty({
        type: Number
    })
    @Allow()
    @Expose()
    limit: number

    @ApiProperty({
        type: Number
    })
    @Allow()
    @Expose()
    total: number
}

export interface ApiPaginateResponseOptions<
    Entity extends AnyObject & Type<any> = any
> {
    type?: Entity
    schema?: SchemaObject & Partial<ReferenceObject>
    description?: string
}

export function ApiOkPaginatedResponse<
    Entity extends AnyObject & Type<any> = any
>(options: ApiPaginateResponseOptions<Entity>) {
    const { type, schema, description = DEFAULT_DESCRIPTION } = options

    const schemaObject = schema ?? { $ref: getSchemaPath(type) }

    return applyDecorators(
        HttpCode(HttpStatus.OK),
        ...(type ? [ApiExtraModels(type)] : []),
        ApiExtraModels(PaginatedResponse),
        ApiResponse({
            status: HttpStatus.OK,
            description,
            schema: {
                allOf: [
                    { $ref: getSchemaPath(PaginatedResponse) },
                    {
                        properties: {
                            data: {
                                type: 'array',
                                items: schemaObject || { type: 'object' }
                            }
                        }
                    },
                    {
                        properties: {
                            page: {
                                type: 'number'
                            },
                            limit: {
                                type: 'number'
                            },
                            total: {
                                type: 'number'
                            }
                        }
                    }
                ]
            }
        })
    )
}
