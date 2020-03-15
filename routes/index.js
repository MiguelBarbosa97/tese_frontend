var express = require('express')
var router = express.Router()


router.get('/', function(req, res) {
  res.render('pages/login', { layout: 'login_layout' })
})

router.get('/home', function(req, res, next) {
  res.render('pages/home')
})
module.exports = router
