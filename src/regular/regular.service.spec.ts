import { RegularService } from './regular.service';
import { Regular } from './entities/regular.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TestBed } from '@automock/jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { schedData, localeData } from './test-data/test-api-data';

describe('RegularService', () => {
  let service: RegularService;
  let repository: jest.Mocked<Repository<Regular>>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(RegularService).compile();
    service = unit;
    repository = unitRef.get(getRepositoryToken(Regular) as string);
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
      repository.save.mockResolvedValue(mockEntity);
      const result = await service.create(mockDTO);
      expect(result).toEqual(mockEntity);
    });

    it('해당 ID 데이터가 이미 존재한다면 ConflictException 에러를 발생시킨다.', async () => {
      repository.findOneBy.mockResolvedValue(mockEntity);
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
      repository.find.mockResolvedValue(mockDB);
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
      repository.findOneBy.mockResolvedValue(mockEntity);
      const result = await service.findOne(validID);
      expect(result).toEqual(mockEntity);
    });

    it('해당 ID 데이터가 존재하지 않을 경우 NotFoundException 에러를 발생시킨다.', async () => {
      const invalidID = mockEntity.id + 1;
      repository.findOneBy.mockResolvedValue(null);
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
      repository.find.mockResolvedValue(mockDB);
      repository.remove = jest.fn().mockImplementation((db) => {
        expect(db).toEqual(mockDB);
        const copyDB: Array<any> = [...db];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const removed = copyDB.map(({ id, ...rest }) => rest);
        db.length = 0;
        return Promise.resolve(removed);
      });
      const result = await service.removeAll();
      expect(mockDB.length).toEqual(0);
      expect(result.length).toEqual(rows);
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).not.toHaveProperty('id');
    });
  });

  describe('parse', () => {
    it('파싱한 데이터가 예상 데이터 값과 동일한 값을 갖는지 확인한다.', async () => {
      const parsedData = {
        id: 0,
        startTime: '2024-10-09T16:00:00Z',
        endTime: '2024-10-09T18:00:00Z',
        rule: '영역 배틀',
        stages: ['넙치 언덕 단지', '해녀 미술 대학'],
      };

      const result = await service.parse(schedData, localeData);
      expect(result).toEqual([parsedData]);
    });
  });
});
