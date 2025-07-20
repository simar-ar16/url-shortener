const express=require('express');
const URL = require('../models/url');

const {handleGenerateNewShortURL,handleGetAnalytics}=require('../controllers/url');
const router=express.Router();

router.post('/', handleGenerateNewShortURL);
router.get('/analytics/:shortID', handleGetAnalytics);

router.post('/delete/:shortId', async (req, res) => {
  const { shortId } = req.params;
  await URL.deleteOne({ shortID: shortId });
  res.redirect('/');
});


module.exports=router;
