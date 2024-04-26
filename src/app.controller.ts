import {
    Controller,
    Get,
    NotImplementedException,
    VERSION_NEUTRAL
} from '@nestjs/common'

@Controller({ path: '/debug', version: VERSION_NEUTRAL })
export class AppController {
    @Get()
    // @Resource()
    getHello(): string {
        throw new NotImplementedException()
    }
}
