const logger = require('logger');
const jwt = require('jsonwebtoken');
const config = require('config');
const UserModel = require('models/user.model');
const bcrypt = require('bcrypt');

class AuthService {

  static generateToken(user, application) {
    logger.debug('Generating token of user ', user);
    return jwt.sign({
      data: user,
      aud: application,
      iss: config.get('auth.issuer')
    }, config.get('auth.jwtSecret'), {
      expiresIn: '1d'
    });
  }

  static async confirmUser(confirmationToken, body) {
    const exist = await UserTempModel.findOne({
      confirmationToken
    });
    if (!exist) {
      return null;
    }
    logger.debug('Checking if exist user with the same email and other provider');
    let user = await UserModel.findOne({
      email: exist.email
    });
    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync(body.password, salt);

    if (user) {
      user.password = password;
      user.salt = salt;
      user.name = exist.name;
      user.codEmployee = exist.codEmployee;
      
    } else {
      user = await new UserModel({
        _id: exist.id,
        name: exist.name,
        email: exist.email,
        password: password,
        codEmployee: exist.codEmployee,
        salt: salt
      });
    }

    await user.save();
    await exist.remove();
    delete user.password;
    delete user.salt;

    return user;
  }

 

  static async existEmail(email) {
    const exist = await UserModel.findOne({
      email
    });


    return exist;
  }

  static async createUser(data) {

    logger.debug('Checking if exist user with the same email and other provider');
   
    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync(data.password, salt);
    const user = new UserModel({
      email: data.email,
      name: data.name,
      password,
      salt
    })

    await user.save();

    try {
      return user;
    } catch (err) {
      logger.error('Error', err);
      throw err;
    }

  }

}

module.exports = AuthService;
