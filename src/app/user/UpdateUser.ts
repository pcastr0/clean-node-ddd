import type { User, UserData } from '../../domain/user/User';
import type { UsersRepository } from '../../domain/user/UsersRepository';

export class UpdateUser {
  private readonly usersRepository: Pick<UsersRepository, 'update'>;

  constructor({ usersRepository }: { usersRepository: Pick<UsersRepository, 'update'> }) {
    this.usersRepository = usersRepository;
  }

  async execute(userId: number, userData: Partial<UserData>): Promise<User> {
    return this.usersRepository.update(userId, userData);
  }
}