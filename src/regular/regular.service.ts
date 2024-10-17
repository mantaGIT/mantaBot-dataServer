// import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreateRegularDto } from './dto/create-regular.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Regular } from './entities/regular.entity';
import { Repository } from 'typeorm';
import { get as lodashGet, map as lodashMap } from 'lodash';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';

@Injectable()
export class RegularService {
  private readonly CONTEXT = 'Regular';

  constructor(
    @InjectRepository(Regular)
    private readonly regularRepository: Repository<Regular>,
    private readonly logger: CustomLoggerService,
  ) {}

  /**
   * Regualr 테이블 데이터를 여러 개 생성합니다.
   * @param createRegularDtos DTO 배열
   * @returns
   */
  async saveAll(createRegularDtos: CreateRegularDto[]): Promise<Regular[]> {
    let result: Regular[] = [];
    try {
      await this.regularRepository.manager.transaction(
        async (transactionalEntityManager) => {
          const entities = transactionalEntityManager.create(
            Regular,
            createRegularDtos,
          );
          result = await transactionalEntityManager.save(entities);
        },
      );
      this.logger.log('Save all schedules', this.CONTEXT);
    } catch (error) {
      const errorMsg = ['Save error', error.message].join(' - ');
      this.logger.error(errorMsg, error.stack, this.CONTEXT);
      throw error;
    }
    return result;
  }

  /**
   * Regular 테이블 전체 조회
   * @returns
   */
  async findAll(): Promise<Regular[]> {
    try {
      this.logger.log('Find schedules', this.CONTEXT);
      return this.regularRepository.find();
    } catch (error) {
      const errorMsg = ['Find error', error.message].join(' - ');
      this.logger.error(errorMsg, error.stack, this.CONTEXT);
      throw error;
    }
  }

  /**
   * Regular 테이블 데이터를 전체 삭제합니다.
   * @returns
   */
  async removeAll(): Promise<Regular[]> {
    let result: Regular[] = [];
    try {
      await this.regularRepository.manager.transaction(
        async (transactionalEntityManager) => {
          const regulars = await transactionalEntityManager.find(Regular);
          result = await transactionalEntityManager.remove(regulars);
        },
      );
      this.logger.log('Remove all schedules', this.CONTEXT);
      return result;
    } catch (error) {
      const errorMsg = ['Remove error', error.message].join(' - ');
      this.logger.error(errorMsg, error.stack, this.CONTEXT);
      throw error;
    }
  }

  /**
   * 원본 데이터를 테이블 Entity에 맞게 파싱합니다.
   * @param schedData 원본 스케줄 데이터
   * @param localeData 원본 한글화 데이터
   * @returns
   */
  async parse(
    schedData: object,
    localeData: object,
  ): Promise<CreateRegularDto[]> {
    try {
      const nodes: Array<object> = lodashGet(
        schedData,
        `data.regularSchedules.nodes`,
      );

      const regulars: CreateRegularDto[] = nodes.map((regularNode, index) => {
        const setting = lodashGet(regularNode, 'regularMatchSetting');
        const ruleId = lodashGet(setting, 'vsRule.id');
        const stageIds = lodashMap(lodashGet(setting, 'vsStages'), 'id');
        return {
          id: index,
          startTime: regularNode['startTime'],
          endTime: regularNode['endTime'],
          rule: localeData['rules'][ruleId]['name'],
          stages: stageIds.map(
            (stageId) => localeData['stages'][stageId]['name'],
          ),
        };
      });
      this.logger.log(`Parse success`, this.CONTEXT);
      return regulars;
    } catch (error) {
      const errorMsg = [`Parse error`, error.message].join(' - ');
      this.logger.error(errorMsg, error.stack, this.CONTEXT);
      throw error;
    }
  }
}
