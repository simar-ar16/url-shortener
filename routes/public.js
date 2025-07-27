const express = require('express');
const { nanoid } = require('nanoid');
const URL = require('../models/url');

const router=express.Router();
router.post('/', async (req, res) => {
   const { fullURL } = req.body;

  if (!fullURL || !fullURL.trim()) {
    return res.render('public', {
      id: null,
      error: "Please provide a valid URL.",
    });
  }

  const url = fullURL.trim();
  const isValidURL = /^(http|https):\/\/[^ "]+$/.test(url);
 if (!isValidURL) {
    return res.render('public', {
      id: null,
      error: "Invalid URL format. Use http:// or https://",
    });
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