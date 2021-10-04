const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csurf = require('csurf');

const indexRouter = require('./routes/index');
const signup = require('./routes/signup');
const login = require('./routes/login');
const logout = require('./routes/logout');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const sessionSetting = {
  secret: 'login_auth_app p',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 }
};

const expressSession = session(sessionSetting);

app.use(expressSession);

app.use((req, res, next) => {
  if (req.session.userId === undefined) {
    res.locals.isLoggedIn = false;
  } else {
    res.locals.name = req.session.name;
    res.locals.isLoggedIn = true;
  }
  next();
});

const csrfProtection = csurf({ cookie: false });
app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/', indexRouter);
app.use('/signup', signup);
app.use('/login', login);
app.use('/logout', logout);


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
  res.render('error');
});

module.exports = app;
