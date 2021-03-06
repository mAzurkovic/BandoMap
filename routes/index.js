var express = require('express');
var mongoose = require('mongoose');
var geocoder = require('geocoder');
var mongo = require('mongodb');
var dateTime = require('date-and-time');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');

var Spot = require('../models/spot');
var User = require('../models/user');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  Spot.find(function(err, spots) {
    if (err) return console.error(err);
  //  console.log(spots);
    res.locals.spots = JSON.stringify(spots)
    res.render('index', { title: 'BandoMap', spots: JSON.stringify(spots), user: req.user });
  });
});

// add by entering an address
router.post('/add-by-address', function(req, res) {
  var location = req.body.address + ", " + req.body.city;
  var hasOutlet = false;
//  console.log(location);

  if (req.body.outletButton == "yes") {  hasOutlet = true; }

  geocoder.geocode(location, function(err, data) {

    var spot = {
      address: location,
      coords: { lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng },
      points: 0,
      type: req.body.type,
      goodFor: req.body.goodFor,
      name: null,
      isOutlet: hasOutlet
    };

    var newSpot = new Spot(spot);
    newSpot.save();

  });

  res.redirect('/');
});

// add by clicking on map
router.post('/add-by-click', function(req, res) {
  var hasOutlet = false;

  console.log(req.body.outletButton);

  if (req.body.outletButton == "yes") {  hasOutlet = true; }

  var spot = {
    address: null,
    coords: { lat: req.body.lat, lng: req.body.lng },
    points: 0,
    type: req.body.type,
    goodFor: req.body.goodFor,
    name: req.body.spot_name,
    personPosting: req.user.facebook.name,
    posterID: req.user.facebook.id,
    isOutlet: hasOutlet,
    flownHere: 0
  };

  var newSpot = new Spot(spot);
  newSpot.save();

  res.redirect('/');
});

// get req. to start adding a new spot
router.get('/new-spot', function(req, res) {
  if (req.user) {
    res.render('add', { title: "Add a spot", user: req.user });
  } else {
    res.redirect('/');
  }
});

// upvote a spot
router.post('/upvote/:id', function(req, res) {
  console.log(req.params.id);

  if (req.user) {
    Spot.findById(req.params.id, function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        doc.points += 1;
        doc.save();
      }

      console.log(doc.points);

      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }

});

// downvote a spot - same as upvoting just subtracting
router.post('/downvote/:id', function(req, res) {
  console.log(req.params.id);

  if (req.user) {
    Spot.findById(req.params.id, function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        doc.points -= 1;
        doc.save();
      }

      console.log(doc.points);

      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }

});

// viewing a spot route
router.get('/view/:id', function(req, res) {
  Spot.findById(req.params.id, function(err, spot) {
    if (err) {
      console.log(err);
    } else {
      // console.log(spot);
      console.log(spot.flownHere);
      res.render('spot', { spot: spot, user: req.user });
    }
  });
});

// adding a comment route
router.post('/view/:spotID/:commenterID/:commenterName', function(req, res) {
  var spotID = req.params.spotID;
  var commenterID = req.params.commenterID;
  var commenterName = req.params.commenterName;

  var comment = {
      commenterName: commenterName,
      commenterID: commenterID,
      body: req.body.commentText,
      commentDate: dateTime.format(new Date(), 'ddd MMM DD YYYY')
  }

  Spot.findById(spotID, function(err, spot) {
    if (err) {
      console.log(err);
    } else {
      spot.comments.unshift(comment);
      spot.save();
    }

    console.log(spot.comments);

    res.redirect('/view/' + spotID);
  });

});

// route to handle how many pilots flew here
router.post('/flewhere/:spotID/:userID/:userName', function (req, res) {
  Spot.findById(req.params.spotID, function(err, spot) {
    if (err) {
      console.log(err);
    } else {
      spot.points++; // also increase the points of the spot
      spot.flownHere++;
      spot.save();
    }

    res.redirect('/view/' + req.params.spotID);
  });
});

router.get('/upvote/:id', function(req, res) {
  console.log(req.params.id);
  res.redirect('/');
});

router.get('/downvote/:id', function(req, res) {
  console.log(req.params.id);
  res.redirect('/');
});

//**********************
// authentication routes
// TODO: add new route file
// *********************
router.get('/login', function(req, res) {
  res.render('login', { title: 'Express'});
});

router.get('/signup', function(req, res) {
  res.render('signup', { title: 'Express'});
});


// route for showing the profile page
router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile', {
    user: req.user // get the user out of session and pass to template
  });
});

// =====================================
// FACEBOOK ROUTES =====================
// =====================================
// route for facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/', // /profile
    failureRedirect: '/'
  }));

// route for logging out
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

module.exports = router;
