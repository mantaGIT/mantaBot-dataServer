import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApiFetchService } from 'src/api-fetch/api-fetch.service';
import { RegularService } from 'src/regular/regular.service';

@Injectable()
export class FetchSchedulerService implements OnModuleInit {
  constructor(
    private readonly apiFetchService: ApiFetchService,
    private readonly regularService: RegularService,
  ) {}

  @Cron('30 0 */2 * * *', { timeZone: 'UTC' })
  async fetchSchedule() {
    // 기존 데이터 전체 삭제하기
    await this.regularService.removeAll();
    console.log('remove all regular schedules');

    // 원본 데이터 가져오기
    const schedules = await this.apiFetchService.apiFetch(
      process.env.SCHED_URL,
    );
    console.log('fetch schedules:', process.env.SCHED_URL);
    const locale = await this.apiFetchService.apiFetch(process.env.LOCALE_URL);
    console.log('fetch locale:', process.env.LOCALE_URL);

    // 데이터 파싱하여 저장하기
    (await this.regularService.parse(schedules, locale)).forEach(
      (regularDTO) => {
        this.regularService.create(regularDTO);
        console.log('save a new regular schedule');
      },
    );
  }

  onModuleInit() {
    this.fetchSchedule();
  }
}
