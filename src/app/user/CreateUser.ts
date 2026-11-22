import { User, type UserData } from '../../domain/user/User';
import type { UsersRepository } from '../../domain/user/UsersRepository';

export class CreateUser {
  private readonly usersRepository: Pick<UsersRepository, 'add'>;

  constructor({ usersRepository }: { usersRepository: Pick<UsersRepository, 'add'> }) {
    this.usersRepository = usersRepository;
  }

  async execute(userData: UserData): Promise<User> {
    return this.usersRepository.add(new User(userData));
  }
}