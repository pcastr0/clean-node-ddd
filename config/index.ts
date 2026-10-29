import dotenv from 'dotenv';
import log4js from 'log4js';
import development from './environments/development';
import test from './environments/test';
import production from './environments/production';
import databaseConfig from './database';

dotenv.config();

export type NodeEnv = 'development' | 'test' | 'production';

export interface EnvSettings {
  web: { port: number };
  logging: log4js.Configuration;
}

export interface DbSettings {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;
  logging?: boolean;
}

export interface Config extends EnvSettings {
  env: NodeEnv;
  isDevelopment: boolean;
  isTest: boolean;
  isProduction: boolean;
  db: DbSettings | string | undefined;
}

const ENV = process.env.NODE_ENV as NodeEnv | undefined;

if (!ENV || !['development', 'test', 'production'].includes(ENV)) {
  throw new Error(`Unknown NODE_ENV "${String(ENV)}". Expected development, test or production.`);
}

const envSettings: Record<NodeEnv, EnvSettings> = { development, test, production };

const config: Config = {
  ...envSettings[ENV],
  env: ENV,
  isDevelopment: ENV === 'development',
  isTest: ENV === 'test',
  isProduction: ENV === 'production',
  db: loadDbConfig(ENV)
};

export default config;

function loadDbConfig(env: NodeEnv): DbSettings | string | undefined {
  if (process.env.CLEARDB_DATABASE_URL) {
    return process.env.CLEARDB_DATABASE_URL;
  }

  return databaseConfig[env];
}