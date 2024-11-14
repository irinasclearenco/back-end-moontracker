import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Symptom } from '../../symptoms/entities/symptom.entity';

@Entity()
@Unique(['userId', 'date'])
export class Moon {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.moons)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  cycleDay: number;

  @Column()
  phase: string;

  @Column()
  startingDay: boolean;

  @Column()
  endingDay: boolean;

  @OneToMany(() => Symptom, (symptoms) => symptoms.moon, {
    onDelete: 'CASCADE',
  })
  symptoms: Symptom[];

  @Column()
  color: string;

  @Column({ nullable: true, type: 'date' })
  lmp: Date;

  @Column({ nullable: true, type: 'date' })
  edd: string;

  @Column({ nullable: true })
  img: string;

  @Column({ nullable: true })
  text: string;
}
