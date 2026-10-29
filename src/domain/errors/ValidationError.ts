export interface ValidationDetail {
  message: string;
  path: (string | number)[];
}

export class ValidationError extends Error {
  readonly details: ValidationDetail[];

  constructor(details: ValidationDetail[]) {
    super('ValidationError');
    this.name = 'ValidationError';
    this.details = details;
  }
}