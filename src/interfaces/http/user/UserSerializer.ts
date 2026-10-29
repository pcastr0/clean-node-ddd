import type { User, UserData } from '../../../domain/user/User';

export const UserSerializer = {
  serialize(user: User): UserData {
    const { id, firstName, middleName, lastName, gender, email, contactNumber, address, birthday } = user;

    return {
      id,
      firstName,
      middleName,
      lastName,
      gender,
      email,
      contactNumber,
      address,
      birthday
    };
  }
};