const express = require('express');
const sql = require('../database');
const router = express.Router();


// GET books detail page.
router.get('/books/detail/:id', function(req, res, next) {
  const id = req.params.id;

  sql.query('SELECT * FROM `books` WHERE `id` =' + id, function (err, results, fields) {
    // console.log(results);
    if (err) {
      // return res.status(500).json({ msg: err });
      res.status(500);
      return res.render('error', { 
        message: 'Sever Error.', 
        error: {
          status: 500,
          stack: err
        } 
      });
    }
    if (results.length === 0) {
      return res.status(404).json({ msg: 'Book not found.' });
    }
    res.render('bookDetail', { title: 'Look Inna Book', book: results[0] });
  });
});

// GET add books page.
router.get('/books/form', function(req, res, next) {
  res.render('addBooks');
});

router.get('/books/search', function(req, res, next) {
  if (!req.query.value) {
    return res.render('search', {
      list: []
    });
  }

  sql.query('SELECT * FROM books WHERE CONCAT(name, author, ISBN, genre) LIKE ?', [`%${req.query.value}%`], function(err, results) {
    console.log(results)
    if (err) {
      return res.status(500).json({ msg: err });
    }
    
    res.render('search', {
      books: results
    });
  })
  
});


// GET books management page.
router.get('/books/management', function(req, res, next) {
  sql.query('SELECT * FROM Books', function (err, results, fields) {
    // console.log(results);
    res.render('booksMng', {
      books: results 
    });
  });
});

// Create a book
router.post('/api/books', function (req, res, next) {
  const data = {
    name: req.body.name,
    author: req.body.author,
    ISBN: req.body.ISBN,
    genre: req.body.genre,
    price: req.body.price,
    pages: req.body.pages,
    publisher_name: req.body.publisherName,
    publisher_address: req.body.publisherAddress,
    publisher_email: req.body.publisherEmail,
    publisher_phone_number: req.body.publisherPhoneNumber,
    publisher_banking_account: req.body.publisherBankingAccount
  };

  console.log(data)

  sql.query('INSERT INTO Books SET ?', data, function (err, results, fields) {
    if (err) {
      return res.status(500).json({ msg: err });
    }
    res.status(200).json({ msg: 'Success.' });
  });
});

// DELETE a book
router.delete('/api/books/:id', function(req, res, next){
  sql.query('DELETE FROM `books` WHERE `id` = ?', [req.params.id], function(err, results) {
    if (err) {
      return res.status(500).json({ msg: err });
    }
    res.status(200).json({ msg: 'Delete Success.' });
  });
});

module.exports = router;