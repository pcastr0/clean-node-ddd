/* eslint-disable no-useless-catch */
const UserMapper = require('./MongooseUserMapper');

class MongooseUserRepository {

  constructor({ UserModel }) {
    this.UserModel = UserModel;
  }

  async getAll() {
    const users = await this.UserModel.find();

    return users.map(UserMapper.toEntity);
  }

  async getById(id) {
    const user = await this._getById(id);

    return UserMapper.toEntity(user);
  }

  async add(user) {
    
    let newUser;

    try {
      await this._validate(user);
      newUser = await this.UserModel(UserMapper.toDatabase(user)).save();
    } catch (error) {
      if (error.code === 11000) {
        const duplicateError = new Error('DuplicateError');
        duplicateError.details = 'Duplicate User found.';

        throw duplicateError;
      }

      throw error;
    }
        
    return UserMapper.toEntity(newUser);
  }

  async update(id, newData) {
    const user = await this._getById(id);

    // await this._validate(newData);
    
    Object.assign(user, newData);

    const updatedUser = await user.save();

    return UserMapper.toEntity(updatedUser);

  }

  async _getById(id) {
    try {
      return await this.UserModel.findById(id);
    } catch (error) {
      if(error.name === 'NotFoundError') {
        const notFoundError = new Error('NotFoundError');
        // notFoundError.details = `User with id ${id} can't be found.`;

        throw notFoundError;
      }

      if(error.name === 'CastrError') {
        const castError = new Error('CastError');

        throw castError;
      }

      throw error;
    }
  }

  async _validate(user) {
    const { valid, errors } = user.validate();

    if(!valid) {
      const error = new Error('ValidationError');
      error.message = errors;
      throw error;
    }
  }

}

module.exports = MongooseUserRepository;