/*external modules*/
import _ from 'lodash';
import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users', schema: 'public' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('citext', { nullable: false, unique: true })
  email: string;

  @Column('varchar', { nullable: true, length: 255, default: null })
  @Exclude()
  password: string;

  @Column('varchar', { default: null, length: 100 })
  googleId: string;

  @Column('boolean', { default: false })
  verified: boolean;

  @Column('boolean', { default: false })
  terms: boolean;

  @Column('simple-array', { nullable: false })
  receivers: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  constructor(email: string, password?: string, receivers?: string[]) {
    super();
    this.email = email;
    this.password = password;
    this.receivers = receivers ?? [];
  }

  addReceivers(receivers: string[]): boolean {
    const diff = _.difference(receivers, this.receivers);
    if(!_.isEmpty(diff)) {
      this.receivers.push(...diff);
    }

    return diff.length > 0;
  }

  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(candidate: string): Promise<boolean> {
    if (!this.password) {
      return false;
    }

    return bcrypt.compare(candidate, this.password);
  }
}
