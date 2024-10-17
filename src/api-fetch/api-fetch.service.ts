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

  async apiFetch(apiUrl: string): Promise<AxiosResponse<object>> {
    try {
      const response = await this.httpService.axiosRef.get(apiUrl);
      this.logger.verbose(`Fetch : ${apiUrl}`, this.CONTEXT); // log
      return response.data;
    } catch (error) {
      // console.log(error);
      // const errorMsg =
      //   error instanceof AxiosError
      //     ? `API Fetch Error - ${apiUrl}, (${error.response.status}) ${error.response.statusText}`
      //     : error.message;
      this.logger.error(error.message, error.stack, this.CONTEXT); // log
      // throw new InternalServerErrorException(error.message);
    }
  }
}
