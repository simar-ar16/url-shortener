const express=require('express');
const {handleUserSignup, handleUserLogin} = require('../controllers/user');
const bcrypt = require('bcrypt');
const User=require('../models/user');
const router=express.Router();
const otpStore = require('../utils/otpStore'); // Adjust path if needed

router.post('/',handleUserSignup);
router.post('/login',handleUserLogin);

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.get("/logout", (req, res) => {
    res.clearCookie("token"); // removes the token cookie
    return res.redirect("/login"); // redirect to login or homepage
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore.get(email);
  if (!record) {
    return res.render('verify-otp', { email, error: 'OTP expired or not found. Please sign up again.' });
  }

  if (record.expiresAt < Date.now()) {
    otpStore.delete(email);
    return res.render('verify-otp', { email, error: 'OTP expired. Please sign up again.' });
  }

  if (record.otp !== otp) {
    return res.render('verify-otp', { email, error: 'Incorrect OTP. Please try again.' });
  }

  await User.create({
    name: record.name,
    email,
    password: record.password,
    isVerified: true,
  });

  otpStore.delete(email);

  return res.redirect('/login');
});


router.get('/verify', (req, res) => {
  const email = req.query.email;
  if (!email) return res.redirect('/signup');
  res.render('verify-otp', { email, message: null, error: null });
});

module.exports=router;