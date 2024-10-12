import { RegularService } from './regular.service';
import { Regular } from './entities/regular.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TestBed } from '@automock/jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { schedData, localeData } from './test-data/test-api-data';

type T = Regular;
type TServie = RegularService;

const testEntity = {
  id: 0,
  startTime: '2024-10-06T14:00:00Z',
  endTime: '2024-10-06T16:00:00Z',
  rule: 'TestRule',
  stages: ['Test-stage1', 'Test-stage2'],
};

describe('RegularService', () => {
  let service: TServie;
  let repository: Array<T>;

  beforeEach(async () => {
    const { unit } = TestBed.create(RegularService)
      .mock<Repository<T>>(getRepositoryToken(Regular) as string)
      .using({
        create: jest.fn((entity: T) => {
          return entity;
        }),
        save: jest.fn((entity: T) => {
          repository.push(entity);
          return entity;
        }),
        find: jest.fn(() => {
          return repository;
        }),
        findOneBy: jest.fn(({ id }: T) => {
          const found = repository.find((x) => x.id === id);
          return found !== undefined ? found : null;
        }),
        remove: jest.fn((entities: Array<T>) => {
          for (const entity of entities)
            repository = repository.filter((x) => x.id !== entity.id);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return entities.map(({ id, ...rest }) => rest);
        }),
      })
      .compile();

    service = unit;
    repository = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('입력받은 데이터를 저장하고 반환한다.', async () => {
      repository = [];
      const result = await service.create(testEntity);
      expect(repository).toContainEqual(testEntity);
      expect(result).toEqual(testEntity);
    });

    it('해당 ID 데이터가 이미 존재한다면 ConflictException 에러를 발생시킨다.', async () => {
      repository = [testEntity];
      try {
        await service.create(testEntity);
      } catch (error) {
        expect(repository).toContainEqual(testEntity);
        expect(error).toBeInstanceOf(ConflictException);
      }
    });
  });

  describe('findAll', () => {
    it('전체 데이터를 배열로 반환한다.', async () => {
      repository = [];
      const result = await service.findAll();
      expect(result).toBeInstanceOf(Array<Regular>);
      expect(result).toEqual(repository);
    });
  });

  describe('findOne', () => {
    it('해당 ID 데이터가 존재할 경우 이를 반환한다.', async () => {
      repository = [testEntity];
      const result = await service.findOne(testEntity.id);
      expect(result).toEqual(testEntity);
    });

    it('해당 ID 데이터가 존재하지 않을 경우 NotFoundException 에러를 발생시킨다.', async () => {
      repository = [];
      try {
        await service.findOne(testEntity.id);
      } catch (error) {
        expect(repository).not.toContainEqual(testEntity);
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('removeAll', () => {
    it('모든 데이터를 삭제하고 삭제된 데이터를 반환한다.', async () => {
      repository = [testEntity];
      const result = await service.removeAll();
      expect(repository.length).toEqual(0);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(1);
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
