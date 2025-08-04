const express = require('express');
const QRCode = require('qrcode');

const router = express.Router();

router.post('/api/generate-qr', async (req, res) => {
  let { url } = req.body;

  // 1. Check if URL is provided
  if (!url) {
    return res.status(400).json({ error: 'Missing URL' });
  }

  // 2. Add https:// if missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  try {
    // 3. Generate QR Code as Base64 Data URL
    const qrDataUrl = await QRCode.toDataURL(url, { errorCorrectionLevel: 'H' });

    // 4. Send JSON response
    res.json({ url, qrDataUrl });
  } catch (err) {
    console.error('QR generation error:', err);
    res.status(500).json({ error: 'Failed to generate QR' });
  }
});

module.exports = router;
