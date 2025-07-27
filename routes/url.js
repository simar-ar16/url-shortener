const express = require('express');
const { nanoid } = require('nanoid');
const URL = require('../models/url');
const { handleGenerateNewShortURL, handleGetAnalytics } = require('../controllers/url');

const router = express.Router();

// Redirect handler
router.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOne({ shortID: shortId });

  if (!entry) return res.status(404).send("Short URL not found");

  entry.visitHistory.push({ timestamp: Date.now() });
  await entry.save();

  return res.redirect(entry.redirectURL);
});

// 🔒 Protected routes
router.get('/analytics/:shortID', handleGetAnalytics);
router.post('/', handleGenerateNewShortURL);

// router.post('/delete/:shortId', async (req, res) => {
//   const { shortId } = req.params;
//   await URL.deleteOne({ shortID: shortId });
//   res.redirect('/');
// });

router.post('/delete/:shortId', async (req, res) => {
  const { shortId } = req.params;
  const redirectFrom = req.query.from; // "home" or "analytics"

  await URL.deleteOne({ shortID: shortId });

  if (req.user?.role === 'ADMIN') {
    return res.redirect(
      redirectFrom === 'analytics' ? '/admin/analytics' : '/home'
    );
  }
  return res.redirect('/home');
});

module.exports = router;
