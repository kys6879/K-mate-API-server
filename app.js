var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var tourRouter = require('./routes/tour');
var touristRouter = require('./routes/tourist');
var chatRouter = require('./routes/chat');
var authRouter = require('./routes/auth');

const passport = require('passport');

require('./passport');

var app = express();

app.use(logger('dev'));
app.use(express.json({
  limit: '50mb'
}));
app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', passport.authenticate('jwt', {
  session: false
}), usersRouter);
app.use('/admin', adminRouter);
app.use('/user', usersRouter);
app.use('/tour', passport.authenticate('jwt', {
  session: false
}), tourRouter);
app.use('/tourist', passport.authenticate('jwt', {
  session: false
}), touristRouter);

app.use('/chat', passport.authenticate('jwt', {
  session: false
}), chatRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  let result = {
    status: false,
    message: err.message
  };
  res.status(500).json(result);
});

module.exports = app;