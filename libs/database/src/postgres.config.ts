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
  synchronize: false;
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
    host: String(get('DB_HOST') ?? get('DATABASE_HOST') ?? ''),
    port: Number(get('DB_PORT') ?? get('DATABASE_PORT') ?? 5432),
    username: String(get('DB_USERNAME') ?? get('DATABASE_USER') ?? ''),
    password: String(get('DB_PASSWORD') ?? get('DATABASE_PASSWORD') ?? ''),
    database: String(get('DB_NAME') ?? get('DATABASE_NAME') ?? ''),
    ssl: readBoolean(get('DB_SSL') ?? get('DATABASE_SSL'), false)
      ? { rejectUnauthorized: false }
      : false,
    logging: readBoolean(get('DB_LOGGING') ?? get('DATABASE_LOGGING'), true),
    synchronize: false,
    migrationsRun: readBoolean(
      get('DB_MIGRATIONS_RUN') ?? get('DATABASE_MIGRATIONS_RUN'),
      true,
    ),
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
