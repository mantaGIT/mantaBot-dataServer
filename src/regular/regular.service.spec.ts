import { Test, TestingModule } from '@nestjs/testing';
import { RegularService } from './regular.service';
import { Regular } from './entities/regular.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
});

describe('RegularService', () => {
  let service: RegularService;
  let repository: MockRepository<Regular>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegularService,
        { provide: getRepositoryToken(Regular), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<RegularService>(RegularService);
    repository = module.get(getRepositoryToken(Regular));
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockDTO = {
      id: 0,
      startTime: '2024-10-06T14:00:00Z',
      endTime: '2024-10-06T16:00:00Z',
      rule: 'TestRule',
      stages: ['Test-stage1', 'Test-stage2'],
    };
    const mockEntity = mockDTO;

    it('입력받은 데이터를 저장하고 반환한다.', async () => {
      jest.spyOn(repository, 'save').mockReturnValue(mockEntity);
      const result = await service.create(mockDTO);
      expect(result).toEqual(mockEntity);
    });

    it('해당 ID 데이터가 이미 존재한다면 ConflictException 에러를 발생시킨다.', async () => {
      jest.spyOn(repository, 'findOneBy').mockReturnValue(mockEntity);
      try {
        await service.create(mockDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });
  });

  describe('findAll', () => {
    const mockDB = [];

    it('전체 데이터를 배열로 반환한다.', async () => {
      jest.spyOn(repository, 'find').mockReturnValue(mockDB);
      const result = await service.findAll();
      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual(mockDB);
    });
  });

  describe('findOne', () => {
    const mockEntity = {
      id: 0,
      startTime: '2024-10-06T14:00:00Z',
      endTime: '2024-10-06T16:00:00Z',
      rule: 'TestRule',
      stages: ['Test-stage1', 'Test-stage2'],
    };

    it('해당 ID 데이터가 존재할 경우 이를 반환한다.', async () => {
      const validID = mockEntity.id;
      jest
        .spyOn(repository, 'findOneBy')
        .mockImplementation(({ id }) =>
          id === mockEntity.id ? mockEntity : null,
        );
      const result = await service.findOne(validID);
      expect(result).toEqual(mockEntity);
    });

    it('해당 ID 데이터가 존재하지 않을 경우 NotFoundException 에러를 발생시킨다.', async () => {
      const invalidID = mockEntity.id + 1;
      jest
        .spyOn(repository, 'findOneBy')
        .mockImplementation(({ id }) =>
          id === mockEntity.id ? mockEntity : null,
        );
      try {
        await service.findOne(invalidID);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('removeAll', () => {
    const mockDB = [
      {
        id: 0,
        startTime: '2024-10-06T14:00:00Z',
        endTime: '2024-10-06T16:00:00Z',
        rule: 'TestRule',
        stages: ['Test-stage1', 'Test-stage2'],
      },
      {
        id: 1,
        startTime: '2024-10-06T14:00:00Z',
        endTime: '2024-10-06T16:00:00Z',
        rule: 'TestRule',
        stages: ['Test-stage1', 'Test-stage2'],
      },
    ];

    it('모든 데이터를 삭제하고 삭제된 데이터를 반환한다.', async () => {
      const rows = mockDB.length;
      jest.spyOn(repository, 'find').mockReturnValue(mockDB);
      jest.spyOn(repository, 'remove').mockImplementation((mockDB) => {
        const copyDB: Array<Regular> = [...mockDB];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const removed = copyDB.map(({ id, ...rest }) => rest);
        mockDB.length = 0;
        return removed;
      });
      const result = await service.removeAll();
      expect(mockDB.length).toEqual(0);
      expect(result.length).toEqual(rows);
      expect(result).toBeInstanceOf(Array<Partial<Regular>>);
    });
  });
});
