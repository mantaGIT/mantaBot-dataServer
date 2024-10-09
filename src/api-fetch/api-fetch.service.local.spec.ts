import { Test, TestingModule } from '@nestjs/testing';
import { ApiFetchService } from './api-fetch.service';
import { HttpModule } from '@nestjs/axios';
import { InternalServerErrorException } from '@nestjs/common';

describe('ApiFetchService', () => {
  let service: ApiFetchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ApiFetchService],
    }).compile();

    service = module.get<ApiFetchService>(ApiFetchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('apiFetch - local', () => {
    it('HTTP GET 요청을 통해 로컬 파일 데이터를 가져온다.', async () => {
      const result = await service.apiFetch(
        'http://localhost:5500/prevData.json',
      );
      // console.log(result);
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
    });

    it('데이터를 가져오지 못할 경우 에러를 발생시킨다.', async () => {
      try {
        await service.apiFetch('http://localhost:5500/prevData-adfdasf.json');
      } catch (error) {
        // console.log(error);
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
