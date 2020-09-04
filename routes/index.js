var express = require('express')
var multer = require('multer')
var crypto = require('crypto')
var mime = require("mime");
var csv = require("csvtojson");

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
  res.send({ filename: req.file.filename });
})
router.post('/uploadLibCss', uploadcss.single('file'), function (req, res, next) {
  res.send({ filename: req.file.filename });
})

router.get('/getGeoData', function (req, res) {
  var json = require('../public/geoJsonMap.json'); //with path
  res.send(json);
});

router.get('/data/1', function (req, res) {
  var csvFilePath = 'C:/Users/migue/OneDrive/Ambiente de Trabalho/benchmarl/MOCK_DATA_#1.csv';
  csv()
    .fromFile(csvFilePath)
    .then(function (jsonArrayObj) {
      res.send(jsonArrayObj);

    })
});

router.get('/data/2', function (req, res) {
  var csvFilePath = 'C:/Users/migue/OneDrive/Ambiente de Trabalho/benchmarl/MOCK_DATA_#2.csv';
  csv()
    .fromFile(csvFilePath)
    .then(function (jsonArrayObj) {
      res.send(jsonArrayObj);

    })
});

router.get('/data/3', function (req, res) {
  var csvFilePath = 'C:/Users/migue/OneDrive/Ambiente de Trabalho/benchmarl/MOCK_DATA_#3.csv';
  csv()
    .fromFile(csvFilePath)
    .then(function (jsonArrayObj) {
      res.send(jsonArrayObj);

    })
});

router.get('/data/4', function (req, res) {
  var csvFilePath = 'C:/Users/migue/OneDrive/Ambiente de Trabalho/benchmarl/MOCK_DATA_#4.csv';
  csv()
    .fromFile(csvFilePath)
    .then(function (jsonArrayObj) {
      res.send(jsonArrayObj);

    })
});
router.get('/data/5', function (req, res) {
  var csvFilePath = 'C:/Users/migue/OneDrive/Ambiente de Trabalho/benchmarl/MOCK_DATA_#5.csv';
  csv()
    .fromFile(csvFilePath)
    .then(function (jsonArrayObj) {
      res.send(jsonArrayObj);

    })
});

router.get('/', function (req, res) {
  res.render('pages/login', { layout: 'login_layout' })
})

router.get('/home', function (req, res, next) {
  res.render('pages/home', { title: 'home' })
})

router.get('/connection', function (req, res, next) {
  res.render('pages/connection', { title: 'connection' })
})

router.get('/query', function (req, res, next) {
  res.render('pages/query', { title: 'query' })
})

router.get('/visualization', function (req, res, next) {
  res.render('pages/visualization', { title: 'visualization' })
})

router.get('/dataVisualizations', function (req, res, next) {
  res.render('pages/datavisualization', { title: 'visualization' })
})
router.get('/libraries', function (req, res, next) {
  res.render('pages/libraries', { title: 'libraries' })
})

router.get('/marketplace', function (req, res, next) {
  res.render('pages/marketplace', { title: 'marketplace' })
})
router.get('/dashboards', function (req, res, next) {
  res.render('pages/dashboardFolder', { title: 'dashboards' })
})

router.get('/dashboard', function (req, res, next) {
  res.render('pages/dashboard', { title: 'dashboards' })
})

router.get('/workspace', function (req, res, next) {
  res.render('pages/workspace', { title: 'workspace' })
})


router.get('/market', function (req, res, next) {
  res.render('pages/market', { title: 'market' })
})
router.get('/marketDetail', function (req, res, next) {
  res.render('pages/marketDetail', { title: 'marketDetail' })
})

router.get('/presentation', function (req, res, next) {
  res.render('pages/presentation', { layout: 'layout_presentation' })
})

module.exports = router
