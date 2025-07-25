
const express = require('express');
const {checkForAuthentication,restrictTo}=require('../middlewares/auth')
const URL=require('../models/url')
const router = express.Router();


// Login Page
router.get('/login', (req, res) => {
  return res.render('login');
});

router.get('/', (req, res) => {
  return res.redirect('/url/public');
});
// Signup Page
router.get('/signup', (req, res) => {
  return res.render('signup');
});

router.get('/home', restrictTo(['NORMAL', 'ADMIN']), async (req, res) => {
  const allUrls = await URL.find({ createdBy: req.user._id });
  res.render("home", { urls: allUrls });
});

router.get('/privacy', (req, res) => {
  res.render('privacy');
});

router.get('/terms', (req, res) => {
  res.render('terms');
});

router.get('/contact', (req, res) => {
  res.render('contact');
});


// Dashboard (optional auth protected if needed)
// router.get('/', restrictTo(["NORMAL", "ADMIN"]), (req, res) => { ... });

module.exports = router;
