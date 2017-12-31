var express = require('express');
var mongoose = require('mongoose');
var geocoder = require('geocoder');
var mongo = require('mongodb');
var Spot = require('../models/spot');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  Spot.find(function(err, spots) {
    if (err) return console.error(err);
    console.log(spots);
    res.locals.spots = JSON.stringify(spots)
    res.render('index', { title: 'BandoMap', spots: JSON.stringify(spots) });
  });
});

// for adding a new spot
router.post('/add', function(req, res) {
  var location = req.body.address + ", " + req.body.city;
  console.log(location);
  geocoder.geocode(location, function(err, data) {

    var spot = {
      address: location,
      coords: { lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng },
      points: 0
    };

    var newSpot = new Spot(spot);
    newSpot.save();

  });

  res.redirect('/');
});

router.post('/upvote/:id', function(req, res) {
  console.log(req.params.id);

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
});

router.post('/downvote/:id', function(req, res) {
  console.log(req.params.id);

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
});

router.get('/upvote/:id', function(req, res) {
  console.log(req.params.id);
  res.redirect('/');
});

router.get('/downvote/:id', function(req, res) {
  console.log(req.params.id);
  res.redirect('/');
});

module.exports = router;
