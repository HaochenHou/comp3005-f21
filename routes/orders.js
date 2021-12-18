const express = require('express');
const sql = require('../database');
const router = express.Router();

router.post('/api/order', async function(req, res, next) {
  // const basketIds = req.body.basketIds.split(',');
  res.status(200).json({ msg: 'Submit Success.' });
});

module.exports = router;
