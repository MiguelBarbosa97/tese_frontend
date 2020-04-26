var express = require('express')
var multer  = require('multer')
var crypto  = require('crypto')
var mime = require("mime");

var storagejs = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/js/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.js');
    });
  }
});

var uploadjs = multer({ storage: storagejs });

var storagecss = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/css/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.css');
    });
  }
});

var uploadcss = multer({ storage: storagecss });
var router = express.Router() 

router.post('/uploadLibJs', uploadjs.single('file'), function (req, res, next) {
  res.send({filename : req.file.filename});
})
router.post('/uploadLibCss', uploadcss.single('file'), function (req, res, next) {
  res.send({filename : req.file.filename});
})

router.get('/', function(req, res) {
  res.render('pages/login', { layout: 'login_layout' })
})

router.get('/home', function(req, res, next) {
  res.render('pages/home')
})

router.get('/connection', function(req, res, next) {
  res.render('pages/connection')
})

router.get('/query', function(req, res, next) {
  res.render('pages/query')
})

router.get('/visualization', function(req, res, next) {
  res.render('pages/visualization')
})

router.get('/dataVisualizations', function(req, res, next) {
  res.render('pages/datavisualization')
})
router.get('/libraries', function(req, res, next) {
  res.render('pages/libraries')
})

router.get('/marketplace', function(req, res, next) {
  res.render('pages/marketplace')
})


module.exports = router
