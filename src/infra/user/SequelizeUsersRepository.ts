import { EmptyResultError } from 'sequelize';
import { ValidationError } from '../../domain/errors/ValidationError';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { User, type UserData } from '../../domain/user/User';
import type { UsersRepository } from '../../domain/user/UsersRepository';
import type { UserModelStatic } from '../database/models/user';
import { UserMapper } from './SequelizeUserMapper';
import type { UserAttributes } from '../database/models/user';

const USER_ATTRIBUTES: (keyof UserAttributes)[] = ['id', 'firstName', 'middleName', 'lastName', 'gender', 'email', 'contactNumber', 'address', 'birthday'];

/**
 * Adapter satisfying the UsersRepository port. Owns all Sequelize knowledge:
 * projection, query options, and translation to domain errors.
 */
export class SequelizeUsersRepository implements UsersRepository {
  private readonly UserModel: UserModelStatic;

  constructor({ UserModel }: { UserModel: UserModelStatic }) {
    this.UserModel = UserModel;
  }

  async getAll(): Promise<User[]> {
    const users = await this.UserModel.findAll({
      attributes: USER_ATTRIBUTES,
      order: [['id', 'ASC']]
    });

    return users.map(UserMapper.toEntity);
  }

  async getById(id: number): Promise<User> {
    const user = await this._getById(id);

    return UserMapper.toEntity(user);
  }

  async add(user: User): Promise<User> {
    assertValid(user);

    const newUser = await this.UserModel.create(UserMapper.toDatabase(user));

    return UserMapper.toEntity(newUser);
  }

  async update(id: number, newData: Partial<UserData>): Promise<User> {
    const user = await this._getById(id);

    const candidate = new User({ ...UserMapper.toEntity(user), ...newData });
    assertValid(candidate);

    await user.update(UserMapper.toDatabase(candidate), { fields: USER_ATTRIBUTES.filter((field) => field !== 'id') });

    return candidate;
  }

  async remove(id: number): Promise<void> {
    const user = await this._getById(id);

    await user.destroy();
  }

  async count(): Promise<number> {
    return await this.UserModel.count();
  }

  // private
  private async _getById(id: number) {
    try {
      return await this.UserModel.findByPk(id, { rejectOnEmpty: true, attributes: USER_ATTRIBUTES });
    } catch (error) {
      if (error instanceof EmptyResultError) {
        throw new NotFoundError(`User with id ${id} can't be found.`);
      }

      throw error;
    }
  }
}

function assertValid(user: User): void {
  const { valid, errors } = user.validate();

  if (!valid) {
    throw new ValidationError(errors);
  }
}