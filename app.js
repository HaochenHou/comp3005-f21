const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const basketsRouter = require('./routes/baskets');
const ordersRouter = require('./routes/orders');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ 
  secret: 'some secret key here',
  resave: true,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));


// Checks user's login status before receives a request.
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.loggedin = true;
    res.locals.user = req.session.user;
  }
  next()
});

app.use((req, res, next) => {
  const adminRoutes = ['/books/form', '/books/management'];
  if (adminRoutes.includes(req.path)) {
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
      next({
        status: 403,
        message: 'Access denied.',
        stack: "Sorry, you don't have access to this page."
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', booksRouter);
app.use('/', basketsRouter);
app.use('/', ordersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
