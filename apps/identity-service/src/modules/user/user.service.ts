import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User | undefined> {
    const result = await this.userRepository.findOne({ where: { id } });
    return result || undefined;
  }

  async findByFields(options: FindOneOptions<User>): Promise<User | undefined> {
    const result = await this.userRepository.findOne(options);
    return result || undefined;
  }

  async findByEmailWithPassword(email: string): Promise<User | undefined> {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
    return result || undefined;
  }

  async findAndCount(
    options: FindManyOptions<User>,
  ): Promise<[User[], number]> {
    return this.userRepository.findAndCount(options);
  }

  async save(user: User, creator?: string): Promise<User> {
    if (creator) {
      if (!user.createdBy) {
        user.createdBy = creator;
      }
      user.updatedBy = creator;
    }
    if (!user.createdAt) {
      user.createdAt = new Date();
    }
    user.updatedAt = new Date();
    await this.hashPasswordIfNeeded(user);
    return this.userRepository.save(user);
  }

  async update(user: User, updater?: string): Promise<User> {
    if (updater) {
      user.updatedBy = updater;
    }
    user.updatedAt = new Date();
    await this.hashPasswordIfNeeded(user);
    return this.userRepository.save(user);
  }

  private async hashPasswordIfNeeded(user: User): Promise<void> {
    if (
      user.password &&
      !user.password.startsWith('$2a$') &&
      !user.password.startsWith('$2b$')
    ) {
      user.password = await hash(user.password, 10);
    }
  }

  async delete(user: User): Promise<void> {
    await this.userRepository.delete({ id: user.id });
  }
}
