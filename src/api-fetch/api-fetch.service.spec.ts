import { ApiFetchService } from './api-fetch.service';
import { HttpService } from '@nestjs/axios';
import { AxiosHeaders } from 'axios';
import { TestBed } from '@automock/jest';
import { InternalServerErrorException } from '@nestjs/common';

const mockResponse = {
  data: { id: 1, name: 'Test Cat' },
  status: 200,
  statusText: 'OK',
  headers: new AxiosHeaders(),
  config: { headers: new AxiosHeaders() },
};

const mockError = {
  isAxiosError: true,
  message: 'Request failed',
  name: 'AxiosError',
  response: {
    status: 404,
    statusText: 'Not Found Error',
    ...mockResponse,
  },
  toJSON: () => ({}),
};

describe('ApiFetchService', () => {
  let service: ApiFetchService;
  let httpService: jest.Mocked<HttpService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ApiFetchService).compile();
    service = unit;
    httpService = unitRef.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('apiFetch', () => {
    it('HTTP GET 요청을 통해 데이터를 가져온다.', async () => {
      httpService.axiosRef.mockResolvedValue(mockResponse);

      const result = await service.apiFetch('http://test.url');
      expect(result).toEqual(mockResponse.data);
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
    });

    it('데이터를 가져오지 못할 경우 에러를 발생시킨다.', async () => {
      httpService.axiosRef.mockResolvedValue(mockError);
      try {
        await service.apiFetch('http://test.url');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
