import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

type PostgresSettings = {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: boolean | { rejectUnauthorized: false };
  logging: boolean;
  synchronize: boolean;
  migrationsRun: boolean;
};

export function readBoolean(
  value: string | boolean | undefined,
  defaultValue: boolean,
): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (value === undefined) {
    return defaultValue;
  }
  return value === 'true';
}

export function postgresSettings(
  get: (key: string) => string | boolean | undefined,
): PostgresSettings {
  return {
    type: 'postgres',
    host: String(get('DATABASE_HOST') ?? ''),
    port: Number(get('DATABASE_PORT') ?? 5432),
    username: String(get('DATABASE_USER') ?? ''),
    password: String(get('DATABASE_PASSWORD') ?? ''),
    database: String(get('DATABASE_NAME') ?? ''),
    ssl: readBoolean(get('DATABASE_SSL'), false)
      ? { rejectUnauthorized: false }
      : false,
    logging: readBoolean(get('DATABASE_LOGGING'), true),
    synchronize: readBoolean(get('DATABASE_SYNCHRONIZE'), false),
    migrationsRun: readBoolean(get('DATABASE_MIGRATIONS_RUN'), true),
  };
}

export function postgresConnectionFromConfig(
  configService: ConfigService,
): TypeOrmModuleOptions {
  return postgresSettings((key) => configService.get(key));
}

export function postgresConnectionFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): PostgresSettings {
  return postgresSettings((key) => env[key]);
}
