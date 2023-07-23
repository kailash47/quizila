const createError = require('http-errors');
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const compression = require('compression');
var cors = require('cors')
// ROUTES
const {userRoute} = require('./component/user');
const {authRoute} = require('./component/auth');
const {qCategoryRoute} = require('./component/qcategory');
const {questionRoute} = require('./component/question');
const {quizRoute} = require('./component/quiz');

// const cron = require('node-cron');
// const signale = require('signale');
// UTILITY
const {checkToken} = require('./shared/utils');

const app = express();

app.use(cors())
// disable for security
app.disable('x-powered-by');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(compression())
app.use(logger('[:date[iso]] :method :url :status :res[content-length] - :response-time ms'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/uploads',express.static(path.join(__dirname, 'uploads')));

app.use('/api/user',checkToken, userRoute);
app.use('/api/auth', authRoute);
app.use('/api/cat',checkToken, qCategoryRoute);
app.use('/api/question',checkToken, questionRoute);
app.use('/api/quiz',checkToken, quizRoute);

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
  console.log(err,"ER");
  res.json({status:err.status || 500,data:{}, message:`${err.status==404 ? 'Page not found':'Internal sever error'}`});
});



module.exports = app;
