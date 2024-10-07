import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RegularService } from './regular.service';
import { CreateRegularDto } from './dto/create-regular.dto';

@Controller('regular')
export class RegularController {
  constructor(private readonly regularService: RegularService) {}

  @Post('create')
  create(@Body() createRegularDto: CreateRegularDto) {
    return this.regularService.create(createRegularDto);
  }

  @Get()
  findAll() {
    return this.regularService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.regularService.findOne(id);
  }

  @Delete()
  removeAll() {
    return this.regularService.removeAll();
  }
}
