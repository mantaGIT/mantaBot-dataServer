import { OmitType } from '@nestjs/mapped-types';
import { CreateRegularDto } from './create-regular.dto';

export class UpdateRegularDto extends OmitType(CreateRegularDto, [
  'id',
] as const) {}
