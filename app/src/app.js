require('dotenv').config()
const logger = require('logger');
const config = require('config');
const Koa = require('koa');
const koaLogger = require('koa-logger');
const loader = require('loader');
const mongoose = require('mongoose');
const sleep = require('sleep');
const cors = require('kcors');
const helmet = require('koa-helmet');
const session = require('koa-session-store');
const MongoStore = require('koa-session-mongo');
const passport = require('koa-passport');

const mongoUri = process.env.MONGO_URI;

mongoose.Promise = Promise;

const koaBody = require('koa-body')({
    multipart: true,
    jsonLimit: '50mb',
    formLimit: '50mb',
    textLimit: '50mb'
});

let retries = 5;

async function init() {
    return new Promise((resolve, reject) => {
        async function onDbReady(err) {
            logger.debug('connected');

            logger.info('Initializing api');
            const app = new Koa();
            app.use(koaLogger());
            app.use(cors());
            app.use(helmet());
           

            app.use(koaBody);
            app.keys = [config.get('sessionKey')];
            app.use(session({    
                store: 'cookie'
            }));

            require('services/passport.service');
            app.use(passport.initialize());
            app.use(passport.session());


            loader.loadRoutes(app);

            const server = app.listen(process.env.PORT, () => {
                
            });
            logger.info('Server started in ', process.env.PORT);
            resolve({ app, server });
        }

        logger.info(`Connecting to MongoDB URL ${mongoUri}`);
        mongoose.connect(mongoUri, { useNewUrlParser: true }, onDbReady);
    });
}

module.exports = init;
