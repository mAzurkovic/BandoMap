var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var geocoder = require('geocoder');
var mongo = require('mongodb');
var index = require('./routes/index');
var users = require('./routes/users');
var Spot = require('./models/spot');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/BandoMap');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

/*app.get('/', function(req, res) {
  Spot.find(function(err, spots) {
    if (err) return console.error(err);
    console.log(spots);
    res.locals.spots = JSON.stringify(spots)
    res.render('index', { title: 'BandoMap', spots: JSON.stringify(spots) });
  });
});

app.post('/add', function(req, res) {
  geocoder.geocode(req.body.address, function(err, data) {

    var spot = {
      address: req.body.address,
      coords: { lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng }
    };
    var newSpot = new Spot(spot);
    newSpot.save();

  });

  res.redirect('/');
}); */

// catch 404 and forward to error handler

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function getCoords(address) {
  geocoder.geocode(address, function(err, data) {
    //console.log(data.results[0].geometry.location);
    return data.results[0].geometry.location;
  });
}

module.exports = app;
