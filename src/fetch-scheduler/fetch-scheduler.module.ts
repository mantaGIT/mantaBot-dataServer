import { Module } from '@nestjs/common';
import { FetchSchedulerService } from './fetch-scheduler.service';
import { ApiFetchModule } from 'src/api-fetch/api-fetch.module';
import { RegularModule } from 'src/regular/regular.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), ApiFetchModule, RegularModule],
  providers: [FetchSchedulerService],
})
export class FetchSchedulerModule {}
