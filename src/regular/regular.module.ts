import { Module } from '@nestjs/common';
import { RegularService } from './regular.service';
import { RegularController } from './regular.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Regular } from './entities/regular.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Regular])],
  controllers: [RegularController],
  providers: [RegularService],
  exports: [RegularService],
})
export class RegularModule {}
