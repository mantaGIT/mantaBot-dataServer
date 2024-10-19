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

  /**
   * 스케줄 데이터를 업데이트합니다. (Cron 기반 동작)
   */
  @Cron('30 0 */2 * * *', { timeZone: 'UTC' })
  async fetchSchedule() {
    try {
      const sched = await this.apiFetchService.apiFetch(process.env.SCHED_URL);
      const locale = await this.apiFetchService.apiFetch(
        process.env.LOCALE_URL,
      );

      // 데이터 파싱하여 저장하기
      const parsedRegulars = await this.regularService.parse(sched, locale);
      await this.regularService.updateAll(parsedRegulars);

      // 로깅
      this.logger.log('Fetch-schedule task success', this.CONTEXT);
    } catch (error) {
      this.logger.error(
        `Fetch-schedule task failure`,
        error.stack,
        this.CONTEXT,
      );
    }
  }

  onModuleInit() {
    this.fetchSchedule();
  }
}
