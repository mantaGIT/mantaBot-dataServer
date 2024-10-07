import { Test, TestingModule } from '@nestjs/testing';
import { RegularController } from './regular.controller';
import { RegularService } from './regular.service';

describe('RegularController', () => {
  let controller: RegularController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegularController],
      providers: [RegularService],
    }).compile();

    controller = module.get<RegularController>(RegularController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
