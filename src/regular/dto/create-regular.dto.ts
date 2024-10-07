import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateRegularDto {
  @IsNumber()
  @Min(0)
  @Max(12)
  readonly id: number;
  @IsString()
  readonly startTime: string;
  @IsString()
  readonly endTime: string;
  @IsString()
  readonly rule: string;
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsString({ each: true })
  readonly stages: string[];
}
