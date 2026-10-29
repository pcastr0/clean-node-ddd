import { user as UserModel } from '../../src/infra/database/models';
import type { UserAttributes } from '../../src/infra/database/models/user';
import dataFaker from './dataFaker';

type UserOverrides = Partial<UserAttributes>;

const userDefaults = (): UserOverrides => ({
  firstName: dataFaker.first(),
  middleName: dataFaker.last(),
  lastName: dataFaker.last(),
  email: dataFaker.email(),
  contactNumber: dataFaker.phone()
});

/**
 * Replaces factory-girl: a tiny factory over the Sequelize models with
 * chance-based defaults. Register more factories by adding a model +
 * defaults pair here.
 */
const factory = {
  create(overrides: UserOverrides = {}) {
    return UserModel.create({ ...userDefaults(), ...overrides });
  },

  async createMany(count: number, overridesList: UserOverrides[] = []) {
    // Sequential: concurrent inserts race for auto-increment ids, which
    // specs that assert on list order depend on.
    const created = [];

    for (let index = 0; index < count; index++) {
      created.push(await factory.create(overridesList[index] ?? {}));
    }

    return created;
  }
};

export default factory;