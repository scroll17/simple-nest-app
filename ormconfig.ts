import dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';

dotenv.config();

export default {
  type: 'postgres',
  url: process.env.POSTGRES_URI,
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
  entities: [__dirname + '/database/entities/**/*.entity.ts'],
  cli: {
    migrationsDir: 'src/database/migrations',
    entitiesDir: 'src/database/entities',
  },
  synchronize: true, // TODO: on prod -> false
  logging: true,
  logger: 'advanced-console',
} as ConnectionOptions;