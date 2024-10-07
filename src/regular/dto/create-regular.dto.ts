export class CreateRegularDto {
  readonly id: number;
  readonly startTime: string;
  readonly endTime: string;
  readonly rule: string;
  readonly stages: string[];
}
