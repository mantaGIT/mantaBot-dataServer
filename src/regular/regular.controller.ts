import { Controller, Get } from '@nestjs/common';
import { RegularService } from './regular.service';
// import { Post, Body, Delete, Param } from '@nestjs/common';
// import { CreateRegularDto } from './dto/create-regular.dto';

@Controller('regular')
export class RegularController {
  constructor(private readonly regularService: RegularService) {}

  // @Post('create')
  // async create(@Body() createRegularDtos: CreateRegularDto[]) {
  //   return await this.regularService.saveAll(createRegularDtos);
  // }

  @Get()
  async findAll() {
    return await this.regularService.findAll();
  }

  // @Get(':id')
  // async findOne(@Param('id') id: number) {
  //   return await this.regularService.findOne(id);
  // }

  // @Delete()
  // async removeAll() {
  //   return await this.regularService.removeAll();
  // }
}
