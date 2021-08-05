import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { BaseEntity, Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users', schema: 'public' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  receivers: string[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: number;

  constructor(email: string, password: string, receivers?: string[]) {
    super();
    this.email = email;
    this.password = password;
    this.receivers = receivers ?? [];
  }

  addReceiver(receiver: string) {
    if (!this.receivers.find((r) => r === receiver)) {
      this.receivers.push(receiver);
    }
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
