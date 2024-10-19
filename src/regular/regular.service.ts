// import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreateRegularDto } from './dto/create-regular.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Regular } from './entities/regular.entity';
import { Repository } from 'typeorm';
import { get as lodashGet, map as lodashMap } from 'lodash';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';

const SCHED_ENTITY = Regular; // typeorm entity
type EntityT = typeof SCHED_ENTITY; // entity type
type DtoT = CreateRegularDto; // dto type

@Injectable()
export class RegularService {
  private readonly CONTEXT = 'Regular';

  constructor(
    @InjectRepository(SCHED_ENTITY)
    private readonly repository: Repository<EntityT>,
    private readonly logger: CustomLoggerService,
  ) {}

  /**
   * Regular 테이블 전체 데이터를 조회합니다.
   * @returns
   */
  async findAll(): Promise<EntityT[]> {
    try {
      const found = this.repository.find();
      this.logger.verbose(`GET API Response Success`, this.CONTEXT);
      return found;
    } catch (error) {
      this.logger.error(
        `Find all error - ${error.message}`,
        error.stack,
        this.CONTEXT,
      );
      throw error;
    }
  }

  /**
   * 입력받은 데이터로 Regular 테이블 전체를 업데이트합니다.
   * @param dtos DTO 배열
   */
  async updateAll(dtos: DtoT[]): Promise<EntityT[] | void> {
    try {
      await this.repository.manager.transaction(async (entityManager) => {
        // remove all
        const found = await entityManager.find(SCHED_ENTITY);
        await entityManager.remove(found);

        // create all
        const entities = entityManager.create(SCHED_ENTITY, dtos);
        const saved = await entityManager.save(entities);
        return saved;
      });
    } catch (error) {
      this.logger.error(
        `Update all error - ${error.message}`,
        error.stack,
        this.CONTEXT,
      );
      throw error;
    }
  }

  /**
   * 원본 데이터를 테이블 Entity에 맞게 파싱합니다.
   * @param schedData 원본 스케줄 데이터
   * @param localeData 원본 한글화 데이터
   * @returns
   */
  async parse(schedData: object, localeData: object): Promise<DtoT[]> {
    try {
      const nodes: Array<object> = lodashGet(
        schedData,
        `data.regularSchedules.nodes`,
      );

      const parsed: DtoT[] = nodes.map((node, index) => {
        const setting = lodashGet(node, 'regularMatchSetting');
        const ruleId = lodashGet(setting, 'vsRule.id');
        const stageIds = lodashMap(lodashGet(setting, 'vsStages'), 'id');
        return {
          id: index,
          startTime: node['startTime'],
          endTime: node['endTime'],
          rule: localeData['rules'][ruleId]['name'],
          stages: stageIds.map(
            (stageId) => localeData['stages'][stageId]['name'],
          ),
        };
      });
      // this.logger.log(`Parse success`, this.CONTEXT);
      return parsed;
    } catch (error) {
      this.logger.error(
        `Parse error - ${error.message}`,
        error.stack,
        this.CONTEXT,
      );
      throw error;
    }
  }
}
