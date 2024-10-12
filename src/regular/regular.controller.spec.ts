import { TestBed } from '@automock/jest';
import { RegularController } from './regular.controller';
import { RegularService } from './regular.service';

type TServie = RegularService;
type TController = RegularController;

describe('RegularController', () => {
  let controller: TController;
  let service: jest.Mocked<TServie>;

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
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('서비스의 findOne() 함수를 호출해야 한다.', async () => {
      await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalled();
    });
  });
});
