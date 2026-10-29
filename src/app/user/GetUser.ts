import type { User } from '../../domain/user/User';
import type { UsersRepository } from '../../domain/user/UsersRepository';

export class GetUser {
  private readonly usersRepository: Pick<UsersRepository, 'getById'>;

  constructor({ usersRepository }: { usersRepository: Pick<UsersRepository, 'getById'> }) {
    this.usersRepository = usersRepository;
  }

  async execute(userId: number): Promise<User> {
    return this.usersRepository.getById(userId);
  }
}