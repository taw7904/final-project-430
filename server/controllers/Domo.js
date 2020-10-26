const models = require('../models');

const { Domo } = models;

// grab all the Domos for a particular user and pass it to the view
const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const updateDomo = (req, res) => {
/* const newDomoData = {
    talent: req.body.talent
    }; */

  Domo.DomoModel.findById(req.body.id, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    if (!doc) {
      return res.json({ error: 'No domos found' });
    }
  let updateDomo = doc;
  updateDomo.talent = req.body.talent;
      console.log(updateDomo);
  const domoPromise = updateDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err2) => {
    console.log(err2);
    return res.status(400).json({ error: 'An error occured' });
  });
  return domoPromise;
  });
};


const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.talent) {
    return res.status(400).json({ error: 'RAWR! Name, age, and talent are required.' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    talent: req.body.talent,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);
  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }
    return res.status(400).json({ error: 'An error occured' });
  });
  return domoPromise;
};

// get JSON responses of Domos for a user to update client dynamically using React
// update without changing pages
const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ domos: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
module.exports.update = updateDomo;
