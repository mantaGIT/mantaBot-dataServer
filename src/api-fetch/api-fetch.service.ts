import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class ApiFetchService {
  constructor(private readonly httpService: HttpService) {}

  async apiFetch(apiUrl: string): Promise<AxiosResponse<object>> {
    try {
      const response = await this.httpService.axiosRef({
        url: apiUrl,
        method: `GET`,
      });
      return response.data;
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError
          ? `API Fetch Error - ${apiUrl}, (${error.response.status}) ${error.response.statusText}`
          : error.message;
      throw new InternalServerErrorException(errorMsg);
    }
  }
}
