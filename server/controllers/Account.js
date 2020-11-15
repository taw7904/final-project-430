const models = require('../models');

// this keeps changing formatting
const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  // remove a user's session
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // cast strings to cover up some security flaws to gaurentee valid types
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    // attach all fields from toAPI to session tracking
    req.session.account = Account.AccountModel.toAPI(account);
    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast strings to cover up some security flaws to gaurentee valid types
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // check if passwords match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // generate new encrypted password hash and salt
  // store in database and send JSON response back to user for success or failure
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };
    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();
    savePromise.then(() => {
      // attach data from toAPI
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/maker' });
    });
    savePromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username taken.' });
      }
      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;
  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };
  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
