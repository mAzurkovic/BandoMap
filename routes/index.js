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
  geocoder.geocode(req.body.address, function(err, data) {

    var spot = {
      address: req.body.address,
      coords: { lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng }
    };
    var newSpot = new Spot(spot);
    newSpot.save();

  });

  res.redirect('/');
});

module.exports = router;
