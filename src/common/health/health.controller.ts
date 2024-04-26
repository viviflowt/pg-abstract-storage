import {
    Controller,
    Get,
    Inject,
    UseGuards,
    VERSION_NEUTRAL
} from '@nestjs/common'
import { ApiExcludeController, ApiTags } from '@nestjs/swagger'
import {
    HealthCheck,
    HealthCheckService,
    HttpHealthIndicator
} from '@nestjs/terminus'
import { ThrottlerGuard } from '@nestjs/throttler'

@Controller({ version: VERSION_NEUTRAL })
@ApiTags('Health')
@UseGuards(ThrottlerGuard)
@ApiExcludeController()
export class HealthController {
    constructor(
        @Inject(HealthCheckService)
        private readonly healthCheck: HealthCheckService,
        @Inject(HttpHealthIndicator)
        private readonly http: HttpHealthIndicator
    ) {}

    @Get('health')
    @HealthCheck()
    async health() {
        return this.healthCheck.check([
            () => this.http.pingCheck('google', 'http://google.com')
        ])
    }
}
