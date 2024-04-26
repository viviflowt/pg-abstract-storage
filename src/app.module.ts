import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { configuration } from './config/configuration'
// import { EventEmitterModule } from '@nestjs/event-emitter'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration]
        }),
        // EventEmitterModule.forRoot({
        //     delimiter: '.'
        // }),
        ScheduleModule.forRoot(),
        CqrsModule
    ],
    controllers: [AppController]
})
export class AppModule {}
