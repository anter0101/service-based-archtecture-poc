import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/common';

@Entity({ name: 'users', schema: 'identity' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ unique: true, type: 'varchar', nullable: false })
  email: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    nullable: false,
    select: false,
  })
  passwordHash: string;
}
