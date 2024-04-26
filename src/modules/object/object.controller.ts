import { Controller, VERSION_NEUTRAL } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ObjectService } from './object.service'

@Controller({
    path: 'objects',
    version: VERSION_NEUTRAL
})
@ApiTags('objects')
export class ObjectController {
    constructor(private readonly objectService: ObjectService) {}

    // @Post()
    // create(@Body() createObjectDto: CreateObjectDto) {
    //     return this.objectService.create(createObjectDto)
    // }

    // @Get()
    // findAll() {
    //     return this.objectService.findAll()
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.objectService.findOne(+id)
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateObjectDto: UpdateObjectDto) {
    //     return this.objectService.update(+id, updateObjectDto)
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.objectService.remove(+id)
    // }
}
