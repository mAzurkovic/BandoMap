var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var spotSchema = new Schema({
  address: String,
  coords: { lat: Number, lng: Number },
  date: { type: Date, default: Date.now }
});

var Spot = mongoose.model('spot', spotSchema);

module.exports = Spot;
