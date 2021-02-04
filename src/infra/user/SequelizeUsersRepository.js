const UserMapper = require('./SequelizeUserMapper');

class SequelizeUsersRepository {
  constructor({ UserModel }) {
    this.UserModel = UserModel;
  }

  async getAll(...args) {
    console.log(this.UserModel);
    const users = await this.UserModel.findAll(...args);

    return users.map(UserMapper.toEntity);
  }

  async getById() {

  }

  async add() {

  }

  async update() {

  }

  async remove() {

  }

  async count() {

  }

  //private
  async _getById() {

  }
}

module.exports = SequelizeUsersRepository;