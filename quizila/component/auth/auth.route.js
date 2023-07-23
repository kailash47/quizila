const express = require('express');
const router = express.Router();
const utils = require('./../../shared/utils');
const authService = require('./auth.service');
const rateLimit = require("express-rate-limit");
const createAccountLimiter = rateLimit({
  windowMs: 60*1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message:
    "Too many request created from this IP, please try again after an hour"
});

router.post('/signin', async(req, res)=> {
  try {
    let body  = req.body;
    let data = await authService.signIn(body);
    utils.loginfo('service','auth.route.js',req.headers,req.method,req.body,'INFO','User Login','');
    res.status(200).json(utils.successResponse(data));
  } catch (error) {
    res.status(500);
    res.json(utils.failedResponse(500,error));
  }
});
router.post('/generate-otp',createAccountLimiter, async(req, res)=> {
  try {
    let body  = req.body;
    let data = await authService.generateOTP(body);
    res.status(200).json(utils.successResponse(data));
  } catch (error) {
    res.status(error.status);
    res.json(utils.failedResponse(error.status,error));
  }
});

router.post('/verify-otp',createAccountLimiter, async(req, res)=> {
  try {
    let body  = req.body;
    let data = await authService.verifyOtp(body);
    res.status(200).json(utils.successResponse(data));
  } catch (error) {
    if(error.status ==400){
      res.status(200).json({ status: 200, data: '', message: error.message });
    }else{
      res.status(500);
      res.json(utils.failedResponse(500,error));
    }
    
  }
});

router.post('/signout',utils.checkToken, async(req, res)=> {
  try {
    let decode = req.decoded;
    let data = await authService.signout(decode);
    res.status(200).json(utils.successResponse(data));
  } catch (error) {
    res.status(500);
    res.json(utils.failedResponse(500,error));
  }
});

router.post('/registration', async(req, res)=> {
  try {
    let body  = req.body;
    let data = await authService.registration(body);
    res.status(200).json(utils.successResponse(data));
  } catch (error) {
    res.status(500);
    res.json(utils.failedResponse(500,error));
  }
});

router.post('/login',createAccountLimiter, async(req, res)=> {
  try {
    let body  = req.body;
    let data = await authService.login(body);
    res.status(200).json(utils.successResponse(data));
  } catch (error) {
    res.status(error.status);
    res.json(utils.failedResponse(error.status||500,error));
  }
});


module.exports = router;