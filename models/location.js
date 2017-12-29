var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
  address: String,
  coords: { lat: Number, lng: Number },
  date: { type: Date, default: Date.now }
});

var Location = mongoose.model('location', locationSchema);

module.exports = Location;
