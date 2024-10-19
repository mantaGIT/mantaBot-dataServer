import { Controller, Get } from '@nestjs/common';
import { RegularService } from './regular.service';

@Controller('regular')
export class RegularController {
  constructor(private readonly regularService: RegularService) {}

  @Get()
  async findAll() {
    return await this.regularService.findAll();
  }
}
