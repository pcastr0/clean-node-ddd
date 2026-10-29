import { User } from '../../domain/user/User';
import type { UserAttributes } from '../database/models/user';

/**
 * Translates between Sequelize rows and the domain entity.
 * Keep the field list in sync with the entity and the serializer.
 */
export const UserMapper = {
  toEntity({ dataValues }: { dataValues: UserAttributes }): User {
    const { id, firstName, middleName, lastName, gender, email, contactNumber, address, birthday } = dataValues;

    return new User({ id, firstName, middleName, lastName, gender, email, contactNumber, address, birthday });
  },

  toDatabase(user: User): Partial<UserAttributes> {
    const { firstName, middleName, lastName, gender, email, contactNumber, address, birthday } = user;

    return {
      firstName,
      middleName,
      lastName,
      gender,
      email,
      contactNumber,
      address,
      birthday: toDatabaseDate(birthday)
    };
  }
};

function toDatabaseDate(birthday: Date | string | null): Date | null {
  if (birthday === null || birthday === undefined || birthday === '') {
    return null;
  }

  return birthday instanceof Date ? birthday : new Date(birthday);
}