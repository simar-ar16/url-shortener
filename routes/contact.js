const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    req.flash('error', 'Please fill in all fields.');
    return res.redirect('/contact');
  }

  try {
    await Contact.create({ name, email, message });
    req.flash('success', 'Message sent successfully!');
    res.redirect('/contact');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/contact');
  }
});


router.get('/contact', (req, res) => {
  const error = req.flash('error')[0];
  const success = req.flash('success')[0];
  res.render('contact', { error, success });
});

module.exports = router;
