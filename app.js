var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var geocoder = require('geocoder');
var mongo = require('mongodb');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
var session = require('express-session');

require('./config/passport')(passport); // pass passport for configuration

var index = require('./routes/index');
var users = require('./routes/users');
var view = require('./routes/view');

var Spot = require('./models/spot');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// required for passport
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/BandoMap');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// show index routes
app.use('/', index);
app.use('/view', view);
app.use('/users', users);

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

// in development, make sure the port is set to 5000
// for production, set port to 3000
app.listen(5000, function () {
  console.log('Example app listening on port !');
});

module.exports = app;
