import { PartialType } from '@nestjs/mapped-types';
import { CreateRegularDto } from './create-regular.dto';

export class UpdateRegularDto extends PartialType(CreateRegularDto) {}
