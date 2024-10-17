import { Module } from '@nestjs/common';
import { ApiFetchService } from './api-fetch.service';
import { HttpModule } from '@nestjs/axios';
import { CustomLoggerModule } from 'src/custom-logger/custom-logger.module';

@Module({
  imports: [HttpModule, CustomLoggerModule],
  providers: [ApiFetchService],
  exports: [ApiFetchService],
})
export class ApiFetchModule {}
