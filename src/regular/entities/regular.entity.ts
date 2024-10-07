import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('regular')
export class Regular {
  @PrimaryColumn()
  id: number;
  @Column({ type: 'varchar', length: 30 })
  startTime: string;
  @Column({ type: 'varchar', length: 30 })
  endTime: string;
  @Column()
  rule: string;
  @Column({ type: 'varchar', length: 30, array: true })
  stages: string[];
}
