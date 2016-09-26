var express = require('express');
var router = express.Router();

var title = 'Super Dupper Video Pooper';

router.get('/', function(req, res, next) {
  res.render('index', { title: title });
});

router.get('/media', function(req, res, next) {
  res.render('media', { title: title });
});

router.get('/other', function(req, res, next) {
  res.render('other', { title: title });
});

module.exports = router;
