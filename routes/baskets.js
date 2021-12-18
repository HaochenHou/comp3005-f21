const express = require('express');
const sql = require('../database');
const router = express.Router();

// GET user's basket's data
router.get('/baskets', function(req, res, next) {
  if (!req.session.user) {
    next({
      status: 403,
      message: 'Access denied.',
      stack: "Sorry, you don't have access to this page. Please Login."
    });
    return;
  }
  const query = 
    `SELECT *, baskets.id FROM baskets \
    INNER JOIN books ON baskets.book_id = books.id \
    WHERE user_id = ? AND status = ?`;
  sql.query(query, [req.session.user.id, 0], function(err, results) {
    if (err) {
      return res.status(500).json({ msg: err });
    }
    console.log(results);
    res.render('baskets', {
      list: results
    });
  });
});

// CREATE a book to baskets
router.post('/api/baskets', function(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ msg: 'Unauthorized.' });
  }
  const data = {
    book_id: req.body.bookId,
    user_id: req.session.user.id
  };
  sql.query('INSERT INTO baskets SET ?', data, function (err, results, fields) {
    if (err) {
      return res.status(500).json({ msg: err });
    }
    console.log(results);
    res.status(200).json({ msg: 'Add Success.' });
  });
});


module.exports = router;