import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { CommonModule } from './common/common.module'
import { configuration } from './config/configuration'
import { CoreModule } from './core'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration]
        }),
        CommonModule,
        CoreModule
    ],
    controllers: [AppController]
})
export class AppModule {}
