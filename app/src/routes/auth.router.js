const logger = require('logger');
const Router = require('koa-router');
const passport = require('koa-passport');
const AuthService = require('services/auth.service');


const router = new Router();


class AuthRouter {

  static async success(ctx) {
    logger.info('Success login');
    const token = AuthService.generateToken(ctx.state.user, 'api');

    ctx.body = { token };
  }

  static async me(ctx) {
    ctx.body = ctx.state.user;
  }

  static async fail(ctx) {
      ctx.throw(401, 'Error login');
  }



  static async registerUser(ctx) {
    logger.info('Registering user');
    let error = null;
    if (!ctx.request.body.email  || !ctx.request.body.name ) {
      error = 'Email, Name are required';
    }
    logger.debug(ctx.request.body);
    if (!error) {
      const exist = await AuthService.existEmail(ctx.request.body.email);
      if (exist) {
        error = 'Email exist';
      }
    }
    if (error) {
      ctx.throw(400, error);
      return;
    }

    try {
      await AuthService.createUser({ ...ctx.request.body});
      logger.debug('Created');
      ctx.body = {
        ok: 1
      };
    } catch (err) {
      logger.debug('Error', err);
      ctx.throw(500, 'Error registering user');
    }
  }


}

router.post('/auth/sign-up', AuthRouter.registerUser);

router.post('/auth/sign-in', passport.authenticate('local', {
  // failureRedirect: '/auth/fail?error=true',
}), AuthRouter.success);
router.get('/me', passport.authenticate('jwt', {
  session: false
}), AuthRouter.me);

module.exports = router;
