const {nanoid} = require('nanoid');
const URL=require('../models/url');

// Generates short URL and stores flash messages (success/error) for redirect display
async function handleGenerateNewShortURL(req, res) {
  const { url } = req.body;

  if (!url) {
    req.flash('error', 'Please enter a valid URL');
    return res.redirect('/home');
  }

  try {
    const shortID = nanoid(8);

    await URL.create({
      shortID,
      redirectURL: url,
      visitHistory: [],
      createdBy: req.user._id
    });

    req.flash('id', shortID); // Store generated short ID temporarily
    return res.redirect('/home'); 
  } catch (err) {
    console.error('Error generating URL:', err);
    req.flash('error', 'Something went wrong. Please try again.');
    return res.redirect('/home');
  }
}


async function handleGetAnalytics(req,res){
    const shortID = req.params.shortID;
    const result=await URL.findOne({shortID});
    return res.json({
        totalClicks: result.visitHistory.length,
        analytis: result.visitHistory,
    });
}

module.exports={
    handleGenerateNewShortURL,
    handleGetAnalytics,
}