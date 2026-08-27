import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { postgresConnectionFromConfig } from '@app/database';
import { CreateUsers1756280000000 } from '../database/migrations/1756280000000-create-users';

@Injectable()
export default class PostgresTypeorm implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...postgresConnectionFromConfig(this.configService),
      schema: 'identity',
      synchronize: false,
      autoLoadEntities: true,
      migrations: [CreateUsers1756280000000],
    };
  }
}
