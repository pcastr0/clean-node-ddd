import type { User, UserData } from './User';

/**
 * The port the application layer depends on. The Sequelize implementation
 * lives in src/infra/user/SequelizeUsersRepository.ts and throws the domain
 * error classes from src/domain/errors.
 */
export interface UsersRepository {
  getAll(): Promise<User[]>;
  getById(id: number): Promise<User>;
  add(user: User): Promise<User>;
  update(id: number, newData: Partial<UserData>): Promise<User>;
  remove(id: number): Promise<void>;
  count(): Promise<number>;
}