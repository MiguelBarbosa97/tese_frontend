var express = require('express')
var router = express.Router()


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

module.exports = router
