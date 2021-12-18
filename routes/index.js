const express = require('express');
const sql = require('../database');
const router = express.Router();

// GET home page.
router.get('/', function(req, res, next) {
  sql.query('SELECT * FROM Books', function (err, results, fields) {
    if (err) {
      return res.status(500).json({ msg: err });
    }
    res.render('index', { 
      title: 'Look Inna Book', 
      books: results 
    });
  });
});

module.exports = router;
