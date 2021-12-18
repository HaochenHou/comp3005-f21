const express = require('express');
const sql = require('../database');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// GET login page
router.get('/login', function(req, res, next) {
  res.render('login');
});

// GET register page
router.get('/register', function(req, res, next) {
  res.render('register');
});


// User Login
router.post('/api/login', function(req, res, next) {
  sql.query('SELECT * FROM `users` WHERE `username` = ?', [req.body.username], function(err, results, fields) {
    console.log(results)
    if (err) {
      return res.status(500).json({ msg: err });
    }
    if (results.length === 0) {
      return res.status(500).json({ msg: 'User not found.' });
    }
    const user = results[0];
    if (user.password !== req.body.password) {
      return res.status(500).json({ msg: 'Password does not match.' });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    res.locals.loggedin = true;
    res.locals.user = req.session.user;

    res.status(200).json({ 
      msg: 'Login Success.',
      data: {
        id: user.id,
        role: user.role
      }
    });
  });
});

// User Registration
router.post('/api/register', function(req, res, next) {
  const { username, password } = req.body;

  sql.query('SELECT * FROM `users` WHERE `username` = ?', [username], function(err, results, fields) {
    console.log(results)
    if (err) {
      return res.status(500).json({ msg: err });
    }
    if (results.length > 0) {
      return res.status(500).json({ msg: 'User already registered.' });
    }
    sql.query('INSERT INTO users SET ?', { username, password, role: 'CUSTOMER' }, function (err, results, fields) {
      if (err) {
        return res.status(500).json({ msg: err });
      }
      req.session.user = {
        id: results.insertId,
        username: username,
        role: 'CUSTOMER'
      };
  
      res.locals.loggedin = true;
      res.locals.user = req.session.user;
      res.status(200).json({ msg: 'Registration Success.' });
    });

    // req.session.user = {
    //   id: user.username,
    //   role: user.role
    // };
  });
});


router.get('/api/logout', function(req, res, next) {
  if (!req.session.user) {
    return res.status(200).json({ msg: 'You cannot log out because you are not logged in.' });
  }

  req.session.user = null;

  res.locals.loggedin = false;
  res.locals.user = req.session.user;

  res.redirect('/');
});


module.exports = router;
