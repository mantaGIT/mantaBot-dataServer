import { TestBed } from '@automock/jest';
import { RegularController } from './regular.controller';
import { RegularService } from './regular.service';
import { Regular } from './entities/regular.entity';

describe('RegularController', () => {
  let controller: RegularController;
  let service: jest.Mocked<RegularService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(RegularController).compile();
    controller = unit;
    service = unitRef.get(RegularService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('서비스의 findAll() 함수를 호출해야 한다.', async () => {
      service.findAll.mockResolvedValue([new Regular()]);
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array<Regular>);
    });
  });

  describe('findOne', () => {
    it('서비스의 findOne() 함수를 호출해야 한다.', async () => {
      service.findOne.mockResolvedValue(new Regular());
      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Regular);
    });
  });
});
