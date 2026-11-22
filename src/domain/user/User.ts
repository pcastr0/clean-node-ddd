import type { ValidationDetail } from '../errors/ValidationError';

export interface UserData {
  id?: number | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  gender?: string | null;
  email?: string | null;
  contactNumber?: string | null;
  address?: string | null;
  birthday?: Date | string | null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED_STRING_FIELDS = ['firstName', 'middleName', 'lastName', 'email', 'contactNumber'] as const;
const NULLABLE_STRING_FIELDS = ['gender', 'address'] as const;

export class User {
  readonly id: number | null;
  readonly firstName: string | null;
  readonly middleName: string | null;
  readonly lastName: string | null;
  readonly gender: string | null;
  readonly email: string | null;
  readonly contactNumber: string | null;
  readonly address: string | null;
  readonly birthday: Date | string | null;

  constructor(data: UserData = {}) {
    this.id = data.id ?? null;
    this.firstName = data.firstName ?? null;
    this.middleName = data.middleName ?? null;
    this.lastName = data.lastName ?? null;
    this.gender = data.gender ?? null;
    this.email = data.email ?? null;
    this.contactNumber = data.contactNumber ?? null;
    this.address = data.address ?? null;
    this.birthday = toBirthday(data.birthday);
  }

  validate(): { valid: boolean; errors: ValidationDetail[] } {
    const errors: ValidationDetail[] = [];

    for (const field of REQUIRED_STRING_FIELDS) {
      const value = this[field];

      if (value === null || value === undefined) {
        errors.push({ message: `"${field}" is required`, path: [field] });
      } else if (value === '') {
        errors.push({ message: `"${field}" is not allowed to be empty`, path: [field] });
      }
    }

    if (this.email !== null && this.email !== '' && !EMAIL_PATTERN.test(this.email)) {
      errors.push({ message: '"email" must be a valid email', path: ['email'] });
    }

    for (const field of NULLABLE_STRING_FIELDS) {
      if (this[field] === '') {
        errors.push({ message: `"${field}" is not allowed to be empty`, path: [field] });
      }
    }

    if (!isValidDate(this.birthday)) {
      errors.push({ message: '"birthday" must be a valid date', path: ['birthday'] });
    }

    return { valid: errors.length === 0, errors };
  }
}

function isValidDate(value: Date | string | null): boolean {
  if (value === null || value === undefined || value === '') {
    return true;
  }

  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }

  return !Number.isNaN(Date.parse(value));
}

// Parity with the old `structure` entity: birthday strings become Date
// instances on construction. Unparseable values pass through untouched so
// validate() can flag them.
function toBirthday(birthday: Date | string | null | undefined): Date | string | null {
  if (birthday === null || birthday === undefined || birthday === '') {
    return null;
  }

  if (birthday instanceof Date) {
    return birthday;
  }

  const parsed = new Date(birthday);

  return Number.isNaN(parsed.getTime()) ? birthday : parsed;
}