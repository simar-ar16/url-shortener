const express = require('express');
const router = express.Router();
const URL = require('../models/url');
const Contact = require('../models/contact');
const restrictToAdmin = require('../middlewares/restrictToAdmin');

router.get('/analytics', restrictToAdmin, async (req, res) => {
  try {
    const urls = await URL.find().populate('createdBy', 'email');
    res.render('adminAnalytics', { urls });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

router.get('/messages', restrictToAdmin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.render('contact-messages', { messages });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  }
});

router.delete('/messages/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    req.flash('success', 'Message deleted successfully!');
    res.redirect('/admin/messages');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete the message.');
    res.redirect('/admin/messages');
  }
});
module.exports = router;
