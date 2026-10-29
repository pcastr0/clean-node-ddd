import type { User } from '../../domain/user/User';
import type { UsersRepository } from '../../domain/user/UsersRepository';

export class GetAllUsers {
  private readonly usersRepository: Pick<UsersRepository, 'getAll'>;

  constructor({ usersRepository }: { usersRepository: Pick<UsersRepository, 'getAll'> }) {
    this.usersRepository = usersRepository;
  }

  async execute(): Promise<User[]> {
    return this.usersRepository.getAll();
  }
}