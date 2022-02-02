import { ConnectionOptions } from "typeorm";

export const confg: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'todo-list',
  synchronize: true,
  entities: ['./dist/**/*.entity.js'],
  logger: 'advanced-console',
  migrationsRun: true,
  migrationsTableName: 'migrations',
}