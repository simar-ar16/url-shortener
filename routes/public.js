const express = require('express');
const { nanoid } = require('nanoid');
const URL = require('../models/url');

const router=express.Router();
// Public short URL generator
router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    req.flash('error', 'Please enter a valid URL');
    return res.redirect('/public');
  }

  const shortID = nanoid(8);
  await URL.create({
    shortID,
    redirectURL: url,
    visitHistory: [],
  });

  req.flash('id', shortID);
  res.redirect('/public');
});


router.get('/', (req, res) => {
  const error = req.flash('error')[0];
  const id = req.flash('id')[0];
  res.render('public', { error, id });
});

module.exports=router;