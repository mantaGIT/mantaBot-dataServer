import { Module } from '@nestjs/common';
import { FetchSchedulerService } from './fetch-scheduler.service';
import { ApiFetchModule } from 'src/api-fetch/api-fetch.module';
import { RegularModule } from 'src/regular/regular.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CustomLoggerModule } from 'src/custom-logger/custom-logger.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ApiFetchModule,
    RegularModule,
    CustomLoggerModule,
  ],
  providers: [FetchSchedulerService],
})
export class FetchSchedulerModule {}
