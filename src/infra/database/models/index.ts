import { Sequelize, type Dialect } from 'sequelize';
import { ModelsLoader } from '../../sequelize';
import config from '../../../../config';
import type { UserModelStatic } from './user';

if (!config.db) {
  throw new Error('Database configuration not found. Set CLEARDB_DATABASE_URL or configure config/database.js.');
}

const dbConfig = config.db;
// database.js declares `dialect` as a plain string; Sequelize wants its literal union.
const sequelize = typeof dbConfig === 'string'
  ? new Sequelize(dbConfig)
  : new Sequelize({ ...dbConfig, dialect: dbConfig.dialect as Dialect });

const models = ModelsLoader.load({
  sequelize,
  baseFolder: __dirname
});

export const database: Sequelize = models.database;
export const user = models.user as UserModelStatic;