import fs from 'fs';
import path from 'path';
import type { Sequelize, Model, ModelStatic } from 'sequelize';

export interface LoadedModels {
  database: Sequelize;
  [modelName: string]: unknown;
}

interface LoaderOptions {
  sequelize: Sequelize;
  baseFolder: string;
}

type ModelFactory = (sequelize: Sequelize) => ModelStatic<Model>;

/**
 * Loads every model file in `baseFolder` by filename convention (any .ts/.js
 * except `index`), calls each factory with the Sequelize instance, then runs
 * any `associate(models)` hooks. Returns the models keyed by filename, plus
 * the Sequelize instance as `database`.
 */
export const ModelsLoader = {
  load({ sequelize, baseFolder }: LoaderOptions): LoadedModels {
    const loaded: Record<string, unknown> = {};

    fs
      .readdirSync(baseFolder)
      .filter((file) => {
        const { name, ext } = path.parse(file);

        return !name.startsWith('.') && (name !== 'index') && ['.js', '.ts'].includes(ext);
      })
      .forEach((file) => {
        // Models are loaded by convention, so the import path is only known at runtime.
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const modelModule = require(path.join(baseFolder, file)) as { default?: ModelFactory } | ModelFactory;
        const modelFactory: ModelFactory | undefined =
          typeof modelModule === 'function' ? modelModule : modelModule.default;

        if (!modelFactory) {
          throw new Error(`Model file "${file}" must export a factory function`);
        }

        const modelName = path.parse(file).name;
        loaded[modelName] = modelFactory(sequelize);
      });

    Object.values(loaded).forEach((model) => {
      const withAssociations = model as { associate?: (models: Record<string, unknown>) => void };

      if (withAssociations.associate) {
        withAssociations.associate(loaded);
      }
    });

    return { ...loaded, database: sequelize } as LoadedModels;
  }
};