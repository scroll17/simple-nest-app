import dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';

dotenv.config();

export default {
  type: 'postgres',
  url: process.env.POSTGRES_URI,
  // host: 'database',
  // port: 5432,
  // username: 'test',
  // password: 'test',
  // database: 'simple_shop',
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
  entities: [__dirname + '/database/entities/**/*.entity.ts'],
  cli: {
    migrationsDir: 'src/database/migrations',
    entitiesDir: 'src/database/entities',
  },
  synchronize: false,
  logging: true,
  logger: 'advanced-console',
} as ConnectionOptions;