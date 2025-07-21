const express = require('express');
const router = express.Router();
const URL = require('../models/url');
const restrictToAdmin = require('../middlewares/restrictToAdmin');

router.get('/analytics', restrictToAdmin, async (req, res) => {
  try {
    const urls = await URL.find().populate('createdBy', 'email');
    res.render('adminAnalytics', { urls });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
