const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let ShowModel = {};

// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const ShowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  rating: {
    type: String,
    required: true,
    trim: true,
  },

  service: {
    type: String,
    required: true,
    trim: true,
  },

  status: {
    type: String,
    required: true,
    trim: true,
  },

  logo: {
    type: String,
    required: true,
    trim: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

ShowSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  rating: doc.rating,
  service: doc.service,
  status: doc.status,
  logo: doc.logo,
});

ShowSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return ShowModel.find(search).select('name rating service status logo').lean().exec(callback);
};

ShowSchema.statics.findById = (id, callback) => {
  const search = {
    _id: convertId(id),
  };
  return ShowModel.findOne(search).exec(callback);
};

ShowModel = mongoose.model('Show', ShowSchema);

module.exports.ShowModel = ShowModel;
module.exports.ShowSchema = ShowSchema;
