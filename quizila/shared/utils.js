const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const signale = require('signale');
signale.config({
  displayFilename: true,
  displayTimestamp: true,
  displayDate: true,
  color:'yellow'
});
//  let {activityLogModel} = require('./../db/dbUtils');

let utils = {
  // checkToken: () => {
  //   return true;
  // },
  successResponse: (data) => {
    return { status: 200, data: data, message: 'success' };
  },
  failedResponse: (statusCode, data) => {
    console.log(data);
    const {message,stack,name,status} = data;
    return { status: status || statusCode || 500, data: message, message: 'failed' };
  },
  generateOTP: async (otp_length) => {
    // Declare a digits variable
    // which stores all digits
    try {
      let digits = "123456789";
      let OTP = "";
      for (let i = 0; i < otp_length; i++) {
        OTP += digits[Math.floor(Math.random() * 9)];
      }
      return OTP;
    } catch (error) {
      throw error;
    }
    
  },
  checkToken: async (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    if (token && token !== undefined) {
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json(utils.failedResponse(401, "Invalid token"));
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      if(req.url === '/payumoney/success' || req.url === '/payumoney/failed' || req.url === '/payumoney'){
        next();
      }else{
        return res.status(401).json(utils.failedResponse(401, "Auth token not supplied"));
      }
    }
  },
  imageFilter: (req, file, cb) => {
    try {
      // Accept images only
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        console.log(error,"IF FILTER");
        return cb(new Error('Only image files are allowed!'), false);
      }
    } catch (error) {
      console.log(error,"IMAGE FILTER");
      return cb(null, true);
    }
  },
  csvToJson:async (csv,delimeter)=>{
    try {
      let lines=csv.split("\r\n");
      let result = [];
      let headers=lines[0].split(delimeter);
      for(let i=1;i<lines.length-1;i++){
        let obj = {};
        let currentline=lines[i].split(delimeter);
        for(let j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      return JSON.stringify(result); //JSON
    } catch (error) {
      return error;
    }
    
  },
  parseErrors: async(validationErrors)=> {
    let errors = [];
    validationErrors.forEach(error => {
      errors.push({
        param: error.params["missingProperty"],
        key: error.keyword,
        message: error.message,
        property: (function() {
          return error.keyword === 'minimum' ? error.dataPath : undefined
        })() 
      });
    });

    return errors;
  },
  generateGameName: (length)=> {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result; 
  },
  maskMobile:(mobile)=>{
    let lastDigit = mobile.substring(6);
    return `******${lastDigit}`;
  },
  getHash:async(password)=>{
    try {
      const hash = bcrypt.hashSync(password, 10);
      return hash;
    } catch (error) {
      throw error;
    }
  },
  checkHashedPassword:async (password,hashedPassword)=>{
    try {
      const hash = bcrypt.compareSync(password, hashedPassword); 
      return hash;
    } catch (error) {
      throw error;
    }
  },
  loginfo:(user,filename,headers,method,body,logtype,message,trace)=>{
    try {
      let data={
        user:user,
        filename:filename,
        headers: headers ? JSON.stringify(headers):{},
        body:body ? JSON.stringify(body):{},
        logtype:logtype || 'INFO',
        message:message,
        trace:trace ? JSON.stringify(trace):{},
      };
      // activityLogModel.create(data).then((resp)=>{
      //   signale.success("INFO LOGGED")
      // }).catch((error)=>{
      //   console.log(error)
      //   signale.error("Error While Logging")
      // })
      
    } catch (error) {
        throw error;
    }
  },
};

module.exports = utils;