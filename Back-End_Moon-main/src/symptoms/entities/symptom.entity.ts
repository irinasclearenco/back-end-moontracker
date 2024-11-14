import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Moon } from '../../moon/entities/moon.entity';

@Entity('symptom') // This specifies the table name
export class Symptom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  symptom: string;

  @ManyToOne(() => Moon, (moon) => moon.symptoms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'moonId' })
  moon: Moon;
}
