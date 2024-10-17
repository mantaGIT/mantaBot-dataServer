import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApiFetchService } from 'src/api-fetch/api-fetch.service';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';
import { RegularService } from 'src/regular/regular.service';

@Injectable()
export class FetchSchedulerService implements OnModuleInit {
  private readonly CONTEXT = 'FetchScheduler';

  constructor(
    private readonly logger: CustomLoggerService,
    private readonly apiFetchService: ApiFetchService,
    private readonly regularService: RegularService,
  ) {}

  @Cron('30 0 */2 * * *', { timeZone: 'UTC' })
  async fetchSchedule() {
    const sched = await this.apiFetchService.apiFetch(process.env.SCHED_URL);
    const locale = await this.apiFetchService.apiFetch(process.env.LOCALE_URL);

    // 기존 데이터 전체 삭제하기
    await this.regularService.removeAll();

    // 데이터 파싱하여 저장하기
    const parsedRegulars = await this.regularService.parse(sched, locale);
    await this.regularService.saveAll(parsedRegulars);
  }

  onModuleInit() {
    this.fetchSchedule();
  }
}
