const passport = require('koa-passport');
const logger = require('logger');
const authConfig = require('config').auth;
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserModel = require('models/user.model');
const bcrypt = require('bcrypt');

async function loginLocal(username, password, done) {
  logger.info('Doing login in local mode with email/codEmployee: ', username);
  let user = await UserModel.findOne({
    $or: [{
      email: username
    }, {
      codEmployee: username
    }]    
  }).exec();
  if (user && user.salt && user.password === bcrypt.hashSync(password, user.salt)) {
    done(null, {
      id: user._id,
      createdAt: user.createdAt,
      name: user.name,
      codEmployee: user.codEmployee,
      email: user.email
    });
  } else {
    done(null, false);
  }
}

logger.info('Loading local auth');
const localStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, loginLocal);
passport.use(localStrategy);

logger.info('Loading jwt auth');
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = authConfig.jwtSecret;
opts.issuer = authConfig.issuer;
opts.audience = authConfig.authorizedApplications.split(',');
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    let user = await UserModel.findById(jwt_payload.data.id).select(['-__v']);
    
    return done(null, {
      id: user._id,
      createdAt: user.createdAt,
      name: user.name,
      codEmployee: user.codEmployee,
      email: user.email
    });
    
  } catch (err) {
    return done(err, false);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
