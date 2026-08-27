import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import * as path from 'path';
import { postgresConnectionFromEnv } from '@app/database';

config({ path: '.env.development' });

export default new DataSource({
  ...postgresConnectionFromEnv(),
  schema: 'identity',
  synchronize: false,
  entities: [path.join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [
    path.join(__dirname, '..', 'database/migrations', '**', '*{.ts,.js}'),
  ],
});
