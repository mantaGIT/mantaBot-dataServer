import { ApiFetchService } from './api-fetch.service';
import { HttpService } from '@nestjs/axios';
import { AxiosHeaders } from 'axios';
import { TestBed } from '@automock/jest';
import { InternalServerErrorException } from '@nestjs/common';

const mockResponse = {
  data: { id: 1, name: 'Test' },
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

enum REQUEST {
  SUCCESS = 'http://request-success',
  FAILURE = 'http://request-failure',
}

describe('ApiFetchService', () => {
  let service: ApiFetchService;

  beforeEach(async () => {
    const { unit } = TestBed.create(ApiFetchService)
      .mock<HttpService>(HttpService)
      .using({
        axiosRef: {
          get: jest.fn((url) =>
            url === REQUEST.SUCCESS ? mockResponse : mockError,
          ),
        },
      })
      .compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('apiFetch', () => {
    it('HTTP GET 요청을 통해 데이터를 가져온다.', async () => {
      const result = await service.apiFetch(REQUEST.SUCCESS);
      expect(result).toEqual(mockResponse.data);
    });

    it('데이터를 가져오지 못할 경우 에러를 발생시킨다.', async () => {
      try {
        await service.apiFetch(REQUEST.FAILURE);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
