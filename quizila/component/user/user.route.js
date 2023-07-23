const express = require('express');
const multer = require('multer');
const router = express.Router();
const utils = require('./../../shared/utils');
const userService = require('./user.service');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const type = req.body.type;
    if(type =="bank"){
      cb(null, 'uploads/bank/');
    }else if (type =="pan"){
      cb(null, 'uploads/pan/');
    }else if(type =="profile_pic"){
      cb(null, 'uploads/profile_pic/');
    }else{
      cb(null, 'uploads/');
    }
      
  },
  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
    const code = req.decoded.id;
    cb(null, code + path.extname(file.originalname));
  }
});
// const upload = multer({ storage: storage /*, fileFilter: utils.imageFilter*/ }).single('profile_pic');

router.post('/user', async (req, res) => {
  try {
      let body = req.body;
      let data = await userService.addUser(body);
      res.status(200).json(utils.successResponse(data));
  } catch (error) {
      res.status(500);
      res.json(utils.failedResponse(500, error));
  }
});

router.post('/user-bulk', async (req, res) => {
  try {
      let body = req.body;
      let data = await userService.addBulkUser(body);
      res.status(200).json(utils.successResponse(data));
  } catch (error) {
      res.status(500);
      res.json(utils.failedResponse(500, error));
  }
});

router.patch('/user', async (req, res) => {
  try {
      let body = req.body;
      let data = await userService.updateUser(body);
      res.status(200).json(utils.successResponse(data));
  } catch (error) {
      res.status(error.status);
      res.json(utils.failedResponse(error.status, error));
  }
});

router.get('/user', async (req, res) => {
  try {
      let body = req.query;
      let data = await userService.getUser(body);
      res.status(200).json(utils.successResponse(data));
  } catch (error) {
      res.status(error.status);
      res.json(utils.failedResponse(error.status, error));
  }
});

router.delete('/user', async (req, res) => {
  try {
      let body = req.query;
      let data = await userService.deleteUser(body);
      res.status(200).json(utils.successResponse(data));
  } catch (error) {
      res.status(error.status);
      res.json(utils.failedResponse(error.status, error));
  }
});


module.exports = router;