import { Module } from '@nestjs/common';
import { ApiFetchService } from './api-fetch.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ApiFetchService],
  exports: [ApiFetchService],
})
export class ApiFetchModule {}
