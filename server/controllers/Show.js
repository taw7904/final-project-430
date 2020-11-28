const models = require('../models');

const { Show } = models;

// grab all the user's shows and pass it to the view
const makerPage = (req, res) => {
  Show.ShowModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), shows: docs });
  });
};

const deleteAll = (req, res) => {
    console.log("delete all...");
  /*Show.ShowModel.findByIdAndDelete(req.session.account._id, (err) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }
    res.json({ redirect: '/maker' });
  });*/
};

const updateShow = (req, res) => {
  Show.ShowModel.findById(req.body.id, (err, doc) => {
    if (err) {
      return res.status(400).json({ error: 'An error occured' });
    }
    if (!doc) {
      return res.json({ error: 'No shows found' });
    }
    const editShow = doc;
    editShow.status = req.body.status;
    const showPromise = editShow.save();

    showPromise.then(() => res.json({ redirect: '/maker' }));
    showPromise.catch((err2) => {
      console.log(err2);
      return res.status(400).json({ error: 'An error occured' });
    });
    return showPromise;
  });
};

const makeShow = (req, res) => {
  if (!req.body.name || !req.body.rating || !req.body.service || !req.body.status) {
    return res.status(400).json({ error: 'Name, rating, service, and status are all required.' });
  }
  let imgString;
  if (req.body.service === 'Netflix') {
    imgString = '/assets/img/netflix.png';
  } else if (req.body.service === 'HBO') {
    imgString = '/assets/img/hbo.png';
  } else if (req.body.service === 'Disney+') {
    imgString = '/assets/img/disneyplus.png';
  } else if (req.body.service === 'Hulu') {
    imgString = '/assets/img/hulu.png';
  } else if (req.body.service === 'Amazon Prime') {
    imgString = '/assets/img/amazon.png';
  } else if (req.body.service === 'Sling TV') {
    imgString = '/assets/img/sling.png';
  } else {
    imgString = '/assets/img/favicon.png';
  }

  const showData = {
    name: req.body.name,
    rating: req.body.rating,
    service: req.body.service,
    status: req.body.status,
    owner: req.session.account._id,
    logo: imgString,
  };

  const newShow = new Show.ShowModel(showData);
  const showPromise = newShow.save();

  showPromise.then(() => res.json({ redirect: '/maker' }));

  showPromise.catch((err) => {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Show already exists' });
    }
    return res.status(400).json({ error: 'An error occured' });
  });
  return showPromise;
};

// get JSON responses of user's shows and update dynamically
const getShows = (request, response) => {
  const req = request;
  const res = response;

  return Show.ShowModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ shows: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getShows = getShows;
module.exports.make = makeShow;
module.exports.update = updateShow;
module.exports.deleteAll = deleteAll;
