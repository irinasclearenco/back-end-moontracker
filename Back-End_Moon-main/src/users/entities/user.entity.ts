import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Column, JoinTable } from 'typeorm';
import { Role } from '../enums/role.enum';
import {
  Permission,
  PermissionType,
} from '../../iam/authorization/permission.type';
import { ApiKey } from '../../api-keys/entities/api-key.entity';
import { Transform } from 'class-transformer';
import moment from 'moment';
import { ApiProperty } from '@nestjs/swagger';
import { Goal } from '../enums/goal.enum';
import { Moon } from '../../moon/entities/moon.entity';
import { Chat } from '../../chat/entities/chat.entity';
import { Article } from '../../articles/entities/article.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  about: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ enum: Goal, default: Goal.MONITORING_PERIODS })
  goal: string;

  @Column({ enum: Role, default: Role.USER })
  role: Role;

  @ApiProperty({ example: '1999-12-12', nullable: true })
  @Transform((date) => moment(date as any).format('YYYY-MM-DD'))
  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ default: 28 })
  cycleLength: number;

  @Column({ default: 5 })
  periodLength: number;

  @Column({ default: 6 })
  follicularPhaseStart: number;

  @Column({ default: 16 })
  follicularPhaseEnd: number;

  @Column({ default: 14 })
  ovulationDay: number;

  @Column({ default: 17 })
  lutealPhaseStart: number;

  @Column({ default: 28 })
  lutealPhaseEnd: number;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  accessCode: string;

  @OneToMany(() => Moon, (moon) => moon.user)
  moons: Moon[];

  @OneToMany(() => Article, (post) => post.user)
  posts: Article[];

  @Column()
  @Column({ default: false })
  isTfaEnabled: boolean;

  @Column({ nullable: true })
  tfaSecret: string;

  @Column({ nullable: true })
  googleId: string;

  @JoinTable()
  @OneToMany((type) => ApiKey, (apiKey) => apiKey.user)
  apiKeys: ApiKey[];

  // DO NOT USE THIS WITH ROLE, THAT ARE NONSENSE
  @Column({ enum: Permission, default: [], type: 'json' })
  permissions: PermissionType[];

  @OneToMany(() => Chat, (message) => message.sender)
  sentMessages: Chat[];

  @OneToMany(() => Chat, (message) => message.receiver)
  receivedMessages: Chat[];
}
