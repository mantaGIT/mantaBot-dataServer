import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegularDto } from './dto/create-regular.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Regular } from './entities/regular.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RegularService {
  constructor(
    @InjectRepository(Regular)
    private readonly regularRepository: Repository<Regular>,
  ) {}

  async create(createRegularDto: CreateRegularDto): Promise<Regular> {
    const regular = await this.regularRepository.findOneBy({
      id: createRegularDto.id,
    });
    if (regular)
      throw new ConflictException(
        `ID #${createRegularDto.id}에 해당하는 데이터가 이미 존재합니다.`,
      );
    const newRegular = this.regularRepository.create(createRegularDto);
    return this.regularRepository.save(newRegular);
  }

  async findAll(): Promise<Regular[]> {
    return this.regularRepository.find();
  }

  async findOne(id: number): Promise<Regular> {
    const regular = await this.regularRepository.findOneBy({ id: id });
    if (!regular)
      throw new NotFoundException(
        `ID #${id}에 해당하는 데이터를 찾을 수 없습니다.`,
      );
    return regular;
  }

  async removeAll(): Promise<Regular[]> {
    const regulars = await this.regularRepository.find();
    return this.regularRepository.remove(regulars);
  }
}
