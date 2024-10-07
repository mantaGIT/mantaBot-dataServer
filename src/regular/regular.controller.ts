import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { RegularService } from './regular.service';
import { CreateRegularDto } from './dto/create-regular.dto';
import { UpdateRegularDto } from './dto/update-regular.dto';

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

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRegularDto: UpdateRegularDto) {
    return this.regularService.update(id, updateRegularDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.regularService.remove(id);
  }
}
