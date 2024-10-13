import { Test, TestingModule } from '@nestjs/testing';
import { FetchSchedulerService } from './fetch-scheduler.service';

describe('FetchSchedulerService', () => {
  let service: FetchSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FetchSchedulerService],
    }).compile();

    service = module.get<FetchSchedulerService>(FetchSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
