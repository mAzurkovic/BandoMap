var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var buildSchema = new Schema({
  frame: String,
  date: { type: Date, default: Date.now }
});

var Build = mongoose.model('build', buildSchema);

module.exports = Build;
