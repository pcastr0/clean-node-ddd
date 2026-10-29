import { Model, DataTypes, type Sequelize } from 'sequelize';

export interface UserAttributes {
  id?: number;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  gender: string | null;
  email: string | null;
  contactNumber: string | null;
  address: string | null;
  birthday: Date | null;
}

export type UserModelStatic = ReturnType<typeof buildUserModel>;

/**
 * Sequelize model for the User entity. Auto-loaded by filename convention
 * via ModelsLoader (see src/infra/sequelize/ModelsLoader.ts).
 */
export default function buildUserModel(sequelize: Sequelize) {
  class UserModel extends Model<UserAttributes> {
    // Sequelize's typings don't surface attributes on instances; declare
    // them so callers get typed rows. Keep in sync with UserAttributes.
    declare public id: number;
    declare public firstName: string | null;
    declare public middleName: string | null;
    declare public lastName: string | null;
    declare public gender: string | null;
    declare public email: string | null;
    declare public contactNumber: string | null;
    declare public address: string | null;
    declare public birthday: Date | null;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * ModelsLoader calls this method automatically.
     */
    static associate(_models: Record<string, unknown>) {
      // define association here
    }
  }

  UserModel.init({
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    gender: DataTypes.STRING,
    email: DataTypes.STRING,
    contactNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    birthday: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User'
  });

  return UserModel;
}