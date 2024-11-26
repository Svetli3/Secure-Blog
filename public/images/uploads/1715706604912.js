var createError = require('http-errors');
var express = require('express');
var session = require('express-session')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var helmet = require('helmet');
// var xss = require('xss-clean');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// SECURE HTTP HEADER
// app.use(helmet());

// LEAVE AS IS, TESTED IT BUT DESTROYS FUNCTIONALITY OF WEBSITE, IN THEORY IT SHOULD DO AS BELOW BUT IT DOESNT
// DATA SANITASATION against site script XSS --\/
// Prevents of adding any HTML in input values, even if it is, the input is converted to string and wont work.
// For example, in my username input box, I add <div id='bad'>bad</div>, this will be added to the database,
// but wont do anything malicious as it is interpreted as a string (weird choice of username if you ask me ;) !).
//app.use(xss());

// Middleware to set Cache-Control header for all responses
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'max-age=0, no-cache, no-store, must-revalidate');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
