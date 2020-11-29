// setup the basic MVC functionality
// server, express MVC, and database connection

// import libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
// connect to redis
const RedisStore = require('connect-redis')(session);
const url = require('url');
// automatically generates unique tokens for each user for each page
// checks on the token request to prevent forgery from another page
const csrf = require('csurf');
const redis = require('redis');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/ShowMaker';

// setup mongoose options to use newer functionality
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(dbURL, mongooseOptions, (err) => {
  if (err) {
    // console.log('Could not connect to database');
    throw err;
  }
});

// get username/password for redis
let redisURL = {
  hostname: 'redis-19291.c114.us-east-1-4.ec2.cloud.redislabs.com',
  port: '19291',
};

let redisPASS = 'fbZAOxVcnKEKBUwD1EC4lpDSpytAVPc7';
if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  [, redisPASS] = redisURL.auth.split(':');
}
const redisClient = redis.createClient({
  host: redisURL.hostname,
  port: redisURL.port,
  password: redisPASS,
});

// pull in our routes
const router = require('./router.js');

const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));
// tracking cookies. default session key name is "connect.sid"
// secret is private string used as seed for hashing
// resave tells session module to refresh key to keep it active
// saveUninitialized tells module to always make sessions when not logged in
// in many production systems, resave and saveUnitiliazed likely false
app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: 'Show Arigato',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
// so people don't know what our server is running
app.disable('x-powered-by');
app.use(cookieParser());

// csrf must come AFTER app.use(cookieParser());
// and app.use(session({....})); should come BEFORE router
// see if the user is up to nonsense! don't respond if so
app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  // console.log('Missing CSRF token');
  return false;
});

router(app);
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  // console.log(`Listening on port ${port}`);
});
