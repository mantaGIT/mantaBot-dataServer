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
      this.logger.error('Save error', error.stack, this.CONTEXT);
      // throw new InternalServerErrorException(error);
    }
    return result;
  }

  async findAll(): Promise<Regular[]> {
    try {
      this.logger.log('Find schedules', this.CONTEXT);
      return this.regularRepository.find();
    } catch (error) {
      this.logger.error('Find error', error.stack, this.CONTEXT);
      // throw new InternalServerErrorException(error);
    }
  }

  // async findOne(id: number): Promise<Regular> {
  //   // findOneBy() : 찾지 못할 경우 return null
  //   const regular = await this.regularRepository.findOneBy({ id: id });
  //   if (!regular)
  //     throw new NotFoundException(
  //       `ID #${id}에 해당하는 데이터를 찾을 수 없습니다.`,
  //     );
  //   return regular;
  // }

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
      this.logger.error('Remove error', error.stack, this.CONTEXT);
      // throw new InternalServerErrorException(error);
    }
  }

  async parse(
    schedData: object,
    localeData: object,
  ): Promise<CreateRegularDto[]> {
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
    return regulars;
  }
}
