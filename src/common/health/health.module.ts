import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { ThrottlerModule } from '@nestjs/throttler'
import ms from 'ms'
import { HealthController } from './health.controller'

@Module({
    imports: [
        TerminusModule,
        HttpModule,
        ThrottlerModule.forRoot([{ ttl: ms('30s'), limit: 10 }])
    ],
    controllers: [HealthController]
})
export class HealthModule {}
