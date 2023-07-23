const dbUtils = require('./../../db/dbUtils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const utils = require('../../shared/utils');
const createError = require('http-errors');
const constants  = require('./../../shared/constants');
const axios = require('axios');
let userService = {
    signIn: async (body) => {
        try {
            const user= await dbUtils.userModel.findOne({ where: { mobile: body.mobile } });
            if(user){
                const generatedOTP =await utils.generateOTP(constants.OTP_LEN);
                const saveOTP = await dbUtils.userModel.update({code:generatedOTP},{where:{id:user.id}});
                if(saveOTP && generatedOTP){
                    // const sendOTP = await userService.sendOTPSMS(generatedOTP,body.mobile);
                    return {otp:generatedOTP,actiontype:'LOGIN',message:utils.maskMobile(body.mobile)};
                }else{
                    return {otp:generatedOTP,actiontype:'LOGIN',message:utils.maskMobile(body.mobile)};
                }
            }else{
                const user= await dbUtils.userModel.create(body);
                const generatedOTP =await utils.generateOTP(constants.OTP_LEN);
                const saveOTP = await dbUtils.userModel.update({code:generatedOTP},{where:{id:user.id}});
                if(saveOTP && generatedOTP){
                    // const sendOTP = await userService.sendOTPSMS(generatedOTP,body.mobile);
                    return {otp:generatedOTP,actiontype:'REGISTER',message:utils.maskMobile(body.mobile)};
                }else{
                    return {otp:generatedOTP,actiontype:'REGISTER',message:utils.maskMobile(body.mobile)};
                }
            }
        } catch (error) {
            console.log(error, 'error');
            throw error;
        }
    },
    generateOTP: async(body)=>{
        try {
            const user= await dbUtils.userModel.findOne({ where: { mobile: body.mobile} });
            if(user){
                const generatedOTP =await utils.generateOTP(constants.OTP_LEN);
                const saveOTP = await dbUtils.userModel.update({code:generatedOTP},{where:{id:user.id}}); 
                if(saveOTP && generatedOTP){
                    // const sendOTP = await userService.sendOTPSMS(generatedOTP,body.mobile);
                    return {otp:generatedOTP,actiontype:'LOGIN',message:utils.maskMobile(body.mobile)};
                }else{
                    return {otp:generatedOTP,actiontype:'LOGIN',message:utils.maskMobile(body.mobile)};
                }
            }else{
                throw createError(400, 'Invalid number');
            }
        } catch (error) {
            throw error
        }
    },
    verifyOtp: async (body)=>{
        try {
            const user= await dbUtils.userModel.findOne({ 
                where: { mobile: body.mobile,code:body.otp || 0}
            });
            if(user){
                const token = jwt.sign({ mobile: user.mobile,id:user.id,gamename:user.game_name}, process.env.SECRET, { expiresIn: '1d' });
                const {exp} = jwt.decode(token);
                const authData = {
                    user_id:user.id,
                    access_token:token,
                    refresh_token:token,
                    // device_id:'45214',
                    expiry: exp
                };
                await dbUtils.authModel.create(authData); 
                return {user,token};
            }else{
                throw createError(400, 'Invalid OTP or Mobile Number');
            }

        } catch (error) {
            throw error;
        }
    },
    signout: async (code) => {
        try {
            const {id,exp} = code;
            const auth= await dbUtils.authModel.destroy({ where: { user_id: id,expiry:exp} });
            return {auth}
        } catch (error) {
            throw error;
        }
    },
    sendOTPSMS:async (otp,mobile)=>{
        // return axios.get(URL).then((response)=> {
        //     return response.data;
        // }).catch((err)=>{
        //     console.log(err);
        //     return err
        // });
        return 'Done'
    },
    login: async (body) => {
        try {
            let data = body;
            let user= await dbUtils.userModel.findOne({ where: { email: data.email , status:true} });
            
            if(user){
                user = user.toJSON();
                let isMatched = await utils.checkHashedPassword(data.code,user.secret);
                if(isMatched){
                    const token = jwt.sign({ email: user.email,id:user.id}, process.env.SECRET, { expiresIn: '1d' });
                    const {exp} = jwt.decode(token);
                    const authData = {
                        user_id:user.id,
                        access_token:token,
                        refresh_token:token,
                        // device_id:'45214',
                        expiry: exp
                    };
                    delete user.code;
                    delete user.secret;
                    await dbUtils.authModel.create(authData); 
                    return {user,token};
                }else{
                    throw createError(400, 'Invalid Username or Password');
                }
            }else{
                throw createError(400, 'Invalid Username or Password');;
            }
            
        } catch (error) {
            throw error;
        }
    },
    registration: async (body) => {
        try {
            let data = body;
            data.code = await utils.getHash(data.code);
            const user= await dbUtils.backendUserModel.create(data);
            return user;
        } catch (error) {
            console.log(error, 'error');
            throw error;
        }
    },

};

module.exports = userService;