import type { UsersRepository } from '../../domain/user/UsersRepository';

export class DeleteUser {
  private readonly usersRepository: Pick<UsersRepository, 'remove'>;

  constructor({ usersRepository }: { usersRepository: Pick<UsersRepository, 'remove'> }) {
    this.usersRepository = usersRepository;
  }

  async execute(userId: number): Promise<void> {
    await this.usersRepository.remove(userId);
  }
}