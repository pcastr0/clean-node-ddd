export class NotFoundError extends Error {
  readonly details: string;

  constructor(details: string) {
    super('NotFoundError');
    this.name = 'NotFoundError';
    this.details = details;
  }
}