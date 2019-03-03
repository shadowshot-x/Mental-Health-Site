var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require("express-session");
var okta = require("@okta/okta-sdk-nodejs");
var ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;



const dashboardRouter = require("./routes/dashboard");         
const publicRouter = require("./routes/public");
const usersRouter = require("./routes/users");
const chatRouter=require("./routes/chat");
const pollRouter=require("./routes/poll");
const blogRouter=require('./routes/blog');
const smsRouter=require('./routes/sms');

var app = express();

var oktaClient = new okta.Client({
  orgUrl: 'https://dev-732356.okta.com',
  token: '00MLKh7sM42jd1grDu0UJIlF1g8QcRuJ_NUCOjP9mZ'
});
const oidc = new ExpressOIDC({
  issuer: "https://dev-732356.okta.com/oauth2/default",
  client_id: "0oabu9cwxcMhCFyUC356",
  client_secret: "aWiJrgV41SxBBh9S2BGn5zfmnvi0DPQYtrBBt_nB",
  redirect_uri: "http://localhost:3000/users/callback",
  scope: "openid profile",
  routes: {
    login: {
      path: "/users/login"
    },
    callback: {
      path: "/users/callback",
      defaultRedirect: "/dashboard"
    }
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'Its not who i am underneath but wgat i do that defines me',
  resave: true,
  saveUninitialized: false
}));
app.use(oidc.router);

app.use((req, res, next) => {
  if (!req.userinfo) {
    return next();
  }

  oktaClient.getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
    }).catch(err => {
      next(err);
    });
});



function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }

  next();
}

app.use('/', publicRouter);
app.use('/dashboard', loginRequired,dashboardRouter);
app.use('/users', usersRouter);
app.use('/chat',loginRequired, chatRouter);
app.use('/poll',loginRequired,pollRouter);
app.use('/blog',loginRequired,blogRouter);
app.use('/sms',smsRouter);

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
