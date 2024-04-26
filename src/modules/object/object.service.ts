import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

@Injectable()
export class ObjectService {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource
    ) {}
}
