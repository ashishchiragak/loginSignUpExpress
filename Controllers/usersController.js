const Config = require('../Config'),
    Models = require('../Models'),
    TokenManager = require('../Libs/tokenManager'),
    Path = require('path'),
    UniversalFunctions = require('../Libs/UniversalFunctions'),
    ERROR = Config.responseMessages.ERROR;

let login = async (request,response) => {
    try {
        let schema=Joi.object().keys({
            email:Joi.string().email().required(),
            password:Joi.string().required(),
            deviceType:Joi.string().required(),
            deviceToken:Joi.string().required(),
        });
        let payload = await UniversalFunctions.validateSchema(request.body, schema, {presence: "required"});

        let criteria ={isDeleted:false, email:payload.email};
        let user = await DAO.getDataOne(Models.Users,criteria,{},{lean:true});
        if(!user) {
            return response.status(Config.APP_CONSTANTS.STATUSCODE.SUCCESS).send({
                ...ERROR.USER_NOT_FOUND
                // success:0,
                // msg:SUCCESS.DEFAULT_SUCCESS,
                // data:{
                //     userData:user,accessToken:accessToken
                // },
                // status:Config.APP_CONSTANTS.STATUSCODE.SUCCESS
            });
        }//throw ERROR.USER_NOT_FOUND;
        if (user.isBlocked){
            return response.status(Config.APP_CONSTANTS.STATUSCODE.SUCCESS).send({
                ...ERROR.BLOCK_USER
                // success:0,
                // msg:SUCCESS.DEFAULT_SUCCESS,
                // data:{
                //     userData:user,accessToken:accessToken
                // },
                // status:Config.APP_CONSTANTS.STATUSCODE.SUCCESS
            });
        } //throw ERROR.BLOCK_USER;
        if (!(user.isEmailVerified)){
            return response.status(Config.APP_CONSTANTS.STATUSCODE.SUCCESS).send({
                ...ERROR.EMAIL_NOT_VERIFIED
                // success:0,
                // msg:SUCCESS.DEFAULT_SUCCESS,
                // data:{
                //     userData:user,accessToken:accessToken
                // },
                // status:Config.APP_CONSTANTS.STATUSCODE.SUCCESS
            });
        } //throw ERROR.EMAIL_NOT_VERIFIED;
        let checkPassword = await UniversalFunctions.compareHash(payload.password, user.password); //compare password string to encrypted string
        if (checkPassword == false){
            return response.status(Config.APP_CONSTANTS.STATUSCODE.SUCCESS).send({
                ...ERROR.WRONG_PASSWORD
                // success:0,
                // msg:SUCCESS.DEFAULT_SUCCESS,
                // data:{
                //     userData:user,accessToken:accessToken
                // },
                // status:Config.APP_CONSTANTS.STATUSCODE.SUCCESS
            });
        } //throw ERROR.WRONG_PASSWORD;

        let tokenData = {
            scope: Config.APP_CONSTANTS.SCOPE.USER,
            _id: user._id,
            time: (new Date()).getTime(),
            isRunner:user.isRunner,
            isRequester:user.isRequester,
            documentsUploaded:user.documentsUploaded,
            isRunnerApproved:user.isRunnerApproved
        };
        let accessToken = await TokenManager.createToken(tokenData, Config.APP_CONSTANTS.SCOPE.USER); // after successful login generate the Auth token for admin to access API's
        await DAO.findAndUpdate(Models.Users, {_id: user._id}, {$set: {tokenTime: tokenData.time,accountDeactivated:false},$addToSet:{token:{deviceType:payload.deviceType,deviceToken:payload.deviceToken,accessToken:accessToken}}},{});
        await DAO.findAndUpdate(Models.Users, {_id: {$ne:user._id},deviceToken:payload.deviceToken}, {$pull:{deviceToken:payload.deviceToken}});
        delete user.password;
        delete user.accessToken;
        delete user.deviceToken;
        // return {userData:user,accessToken:accessToken};
        return response.status(Config.APP_CONSTANTS.STATUSCODE.SUCCESS).send({
            success:200,
            msg:SUCCESS.DEFAULT_SUCCESS,
            data:{
                userData:user,accessToken:accessToken
            },
            status:Config.APP_CONSTANTS.STATUSCODE.SUCCESS
        });

    }catch (e) {
        console.log(e,'eeeeeeee');
        if(e.isJoi){
            return response.status(Config.APP_CONSTANTS.STATUSCODE.BAD_REQUEST).send({
                success:0,
                msg: e.details[0].message,
                status:Config.APP_CONSTANTS.STATUSCODE.BAD_REQUEST
            });
        }else {
            return response.status(Config.APP_CONSTANTS.STATUSCODE.INTERNAL_SERVER_ERROR).send({
                success:0,
                msg: e,
                status:Config.APP_CONSTANTS.STATUSCODE.INTERNAL_SERVER_ERROR
            });
        }
    }
};
let register = async (request,response) => {
    try{
        let schema=Joi.object().keys({
            email:Joi.string().email().required(),
            password:Joi.string().required(),
            firstName:Joi.string().required(),
            lastName:Joi.string().required(),
        });
        let payload = await UniversalFunctions.validateSchema(request.body, schema, {presence: "required"});
console.log('register',request.body);
        let criteria = {
            isDeleted: false,
            isBlocked: false,
            email:payload.email
        };
        let getUser = await DAO.count(Models.Users,criteria);
        if(getUser){
            return response.status(Config.APP_CONSTANTS.STATUSCODE.SUCCESS).send({
                ...ERROR.USER_ALREADY_EXISTS
                // success:0,
                // msg:SUCCESS.DEFAULT_SUCCESS,
                // data:{
                //     user:profile,
                //     accessToken:request.headers['authorization']
                // },
                // status:Config.APP_CONSTANTS.STATUSCODE.SUCCESS
            });
            // throw ERROR.USER_ALREADY_EXISTS
        }else {
            // password
            let password = await UniversalFunctions.hashString(payload.password.toString());
            //email verification token generation
            let tokenData = {
                scope: Config.APP_CONSTANTS.SCOPE.USER,
                _id: Math.random(),
                time: (new Date()).getTime()
            };
            let verifyEmailToken = await TokenManager.createToken(tokenData); // after successful login generate the Auth token for admin to access API's
            criteria = {...criteria,firstName:payload.firstName,lastName:payload.lastName,password:password,verifyEmailToken:verifyEmailToken};
            await DAO.saveData(Models.Users,criteria);
            // send the link to user email
            let link=Config.APP_CONSTANTS.LINKS.VERIFY_EMAIL+verifyEmailToken;
            return response.status(Config.APP_CONSTANTS.STATUSCODE.SUCCESS).send({
                success:0,
                msg:SUCCESS.DEFAULT_SUCCESS,
                data:{
                    link
                },
                status:Config.APP_CONSTANTS.STATUSCODE.SUCCESS
            });
        }
    }catch (e) {
        console.log(e,'eeeeeeee');
        if(e.isJoi){
            return response.status(Config.APP_CONSTANTS.STATUSCODE.BAD_REQUEST).send({
                success:0,
                msg: e.details[0].message,
                status:Config.APP_CONSTANTS.STATUSCODE.BAD_REQUEST
            });
        }else {
            return response.status(Config.APP_CONSTANTS.STATUSCODE.INTERNAL_SERVER_ERROR).send({
                success:0,
                msg: e,
                status:Config.APP_CONSTANTS.STATUSCODE.INTERNAL_SERVER_ERROR
            });
        }
    }
};

let getProfile = async (request,response) => {
    try {
        // let schema=Joi.object().keys({
        //     verifyEmailToken:Joi.string().required()
        // });
        // let payload = await UniversalFunctions.validateSchema(request.query, schema, {presence: "required"});

        let profile = await DAO.getDataOne(Models.Users,{_id:request.auth.userData._id},{token:0,password:0,__v:0},{lean:true});
        profile = {...profile,accessToken:request.headers['authorization']};
        return response.status(Config.APP_CONSTANTS.STATUSCODE.SUCCESS).send({
            success:0,
            msg:SUCCESS.DEFAULT_SUCCESS,
            data:{
                user:profile,
                accessToken:request.headers['authorization']
            },
            status:Config.APP_CONSTANTS.STATUSCODE.SUCCESS
        });
    }catch (e) {
        console.log(e,'eeeeeeee');
        if(e.isJoi){
            return response.status(Config.APP_CONSTANTS.STATUSCODE.BAD_REQUEST).send({
                success:0,
                msg: e.details[0].message,
                status:Config.APP_CONSTANTS.STATUSCODE.BAD_REQUEST
            });
        }else {
            return response.status(Config.APP_CONSTANTS.STATUSCODE.INTERNAL_SERVER_ERROR).send({
                success:0,
                msg: e,
                status:Config.APP_CONSTANTS.STATUSCODE.INTERNAL_SERVER_ERROR
            });
        }
    }
};
let verifyEmail = async (request,response) => {
    try {
        let schema=Joi.object().keys({
            verifyEmailToken:Joi.string().required()
        });
        let payload = await UniversalFunctions.validateSchema(request.query, schema, {presence: "required"});

        let verify = await DAO.findAndUpdate(Models.Users,{
            verifyEmailToken:payload.verifyEmailToken,
        },{$set:{isEmailVerified:true},$unset:{verifyEmailToken:1}},{});
        if(verify){
            // return {verify:true,fileName:'verifyEmail'}
            return response.sendFile(Path.resolve(".")+'/views/verifyEmail.html');
        }else{
            // return {verify:false,fileName:'userNotFound'}
            return response.sendFile(Path.resolve(".")+'/views/userNotFound.html');
        }
    }catch (e) {
        console.log(e,'eeeeeeee');
        if(e.isJoi){
            return response.status(Config.APP_CONSTANTS.STATUSCODE.BAD_REQUEST).send({
                success:0,
                msg: e.details[0].message,
                status:Config.APP_CONSTANTS.STATUSCODE.BAD_REQUEST
            });
        }else {
            return response.status(Config.APP_CONSTANTS.STATUSCODE.INTERNAL_SERVER_ERROR).send({
                success:0,
                msg: e,
                status:Config.APP_CONSTANTS.STATUSCODE.INTERNAL_SERVER_ERROR
            });
        }
    }
};

module.exports = {
    login:login,
    register:register,
    getProfile:getProfile,
    verifyEmail:verifyEmail
};