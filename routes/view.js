var express = require('express');
var mongoose = require('mongoose');
var geocoder = require('geocoder');
var mongo = require('mongodb');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');

var Spot = require('../models/spot');
var User = require('../models/user');

var router = express.Router();

router.get('/:id', function(req, res) {
  Spot.findById(req.params.id, function(err, spot) {
    if (err) {
      console.log(err);
    } else {
      // console.log(spot);
      res.render('spot', { spot: spot, user: req.user });
    }
  });
});

router.get('/abc', function(req, res) {
  res.send('Comment');
});

module.exports = router;
