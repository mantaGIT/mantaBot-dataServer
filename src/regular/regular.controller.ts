import { Controller, Get, Param } from '@nestjs/common';
import { RegularService } from './regular.service';
// import { Post, Body, Delete } from '@nestjs/common';
// import { CreateRegularDto } from './dto/create-regular.dto';

@Controller('regular')
export class RegularController {
  constructor(private readonly regularService: RegularService) {}

  // @Post('create')
  // async create(@Body() createRegularDto: CreateRegularDto) {
  //   return await this.regularService.create(createRegularDto);
  // }

  @Get()
  async findAll() {
    return await this.regularService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.regularService.findOne(id);
  }

  // @Delete()
  // async removeAll() {
  //   return await this.regularService.removeAll();
  // }
}
