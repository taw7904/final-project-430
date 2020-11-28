const controllers = require('./controllers');
const mid = require('./middleware');

// connect as many middleware calls as you want in order you want them to run
// first parameter is always URL
// last parameter is always the controller
// everything in between is any of middleware operations
const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getShows', mid.requiresLogin, controllers.Show.getShows);
  // need secure for login
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  // need secure for sign up
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  // make sure they are logged in to be able to log out
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  // need to be logged in to view or make characters
  app.get('/maker', mid.requiresLogin, controllers.Show.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Show.make);
  app.post('/update', mid.requiresLogin, controllers.Show.update);
  app.post('/delete', mid.requiresLogin, controllers.Show.deleteAll);
  app.post('/changePass', mid.requiresLogin, controllers.Account.changePass);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
