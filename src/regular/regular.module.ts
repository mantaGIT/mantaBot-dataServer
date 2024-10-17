import { Module } from '@nestjs/common';
import { RegularService } from './regular.service';
import { RegularController } from './regular.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Regular } from './entities/regular.entity';
import { CustomLoggerModule } from 'src/custom-logger/custom-logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Regular]), CustomLoggerModule],
  controllers: [RegularController],
  providers: [RegularService],
  exports: [RegularService],
})
export class RegularModule {}
