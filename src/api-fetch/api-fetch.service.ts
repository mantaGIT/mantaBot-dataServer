import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';

@Injectable()
export class ApiFetchService {
  private readonly CONTEXT = 'ApiFetch';

  constructor(
    private readonly httpService: HttpService,
    private readonly logger: CustomLoggerService,
  ) {}

  /**
   * 주어진 API에 GET 요청을 보낸다.
   * @param apiUrl GET API 엔드포인트
   * @returns
   */
  async apiFetch(apiUrl: string): Promise<AxiosResponse<object>> {
    try {
      // HTTP api GET 요청 -> 응답 데이터 반환
      const response = await this.httpService.axiosRef.get(apiUrl);
      this.logger.verbose(`Fetch : ${apiUrl}`, this.CONTEXT); // log
      return response.data;
    } catch (error) {
      // API 엔드포인트 - 에러 메시지 로깅
      const errorMsg = [`${apiUrl}`, error.message].join(' - ');
      this.logger.error(errorMsg, error.stack, this.CONTEXT);
      throw error;
    }
  }
}
