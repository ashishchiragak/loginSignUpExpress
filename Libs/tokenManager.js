const jwt = require('jsonwebtoken');
const Models = require('../Models');
const Config = require('../Config');

const tokenVerification = async (request, response, next) => {
    try {
        console.log(" ************ tokenVerification *****************");
        const token = request.headers['authorization'];
        if (!token) {
            return response.status(Config.APP_CONSTANTS.STATUSCODE.BAD_REQUEST).send({
                success:0,
                msg:Config.responseMessages.ERROR.NO_ACCESS_TOKEN,
                status:Config.APP_CONSTANTS.STATUSCODE.BAD_REQUEST
            });
        } else {
            let accessToken=token.split(" ");
            if(accessToken.length>1){
                // with bearer
                accessToken = accessToken[1];
            }else{
                // without bearer
                accessToken = accessToken[0];
            }

            let verify = await jwt.verify(accessToken,Config.APP_CONSTANTS.SERVER.JWT_SECRET);
            let model;
            switch (verify.scope) {
                case Config.APP_CONSTANTS.SCOPE.ADMIN:{
                    model = Models.Admins;
                    break;
                }
                case Config.APP_CONSTANTS.SCOPE.USER:{
                    model = Models.Users;
                    break;
                }
                default:{
                    model = null
                }
            }
            if(model){
                let verifyInDb = await DAO.getDataOne(model,{_id:verify._id,'token.accessToken':{$in:[accessToken]}},
                    {}, {});
                if(verifyInDb){
                    // request.body.userData=verifyInDb;
                    request.auth = {};
                    request.auth.userData=verifyInDb;
                    if(verifyInDb.isDeleted){
                        return response.status(Config.APP_CONSTANTS.STATUSCODE.BAD_REQUEST).send({
                            success:0,
                            msg:ERROR.DELETED,
                            status:Config.APP_CONSTANTS.STATUSCODE.BAD_REQUEST
                        });
                    }
                    if(verifyInDb.isBlocked){
                        return response.status(Config.APP_CONSTANTS.STATUSCODE.BAD_REQUEST).send({
                            success:0,
                            msg:ERROR.BLOCKED,
                            status:Config.APP_CONSTANTS.STATUSCODE.BAD_REQUEST
                        });
                    }
                    next();
                }else{
                    return response.status(Config.APP_CONSTANTS.STATUSCODE.UNAUTHORISED).send({
                        success:0,
                        msg:Config.responseMessages.ERROR.INVALID_ACCESS_TOKEN,
                        status:Config.APP_CONSTANTS.STATUSCODE.UNAUTHORISED
                    });
                }
            }else{
                return response.status(Config.APP_CONSTANTS.STATUSCODE.UNAUTHORISED).send({
                    success:0,
                    msg:Config.responseMessages.ERROR.INVALID_ACCESS_TOKEN,
                    status:Config.APP_CONSTANTS.STATUSCODE.UNAUTHORISED
                });
            }
        }
    }catch (e) {
        console.log(e,'error in token manager');
        return response.status(Config.APP_CONSTANTS.STATUSCODE.INTERNAL_SERVER_ERROR).send({
            success:0,
            msg: e,
            status:Config.APP_CONSTANTS.STATUSCODE.INTERNAL_SERVER_ERROR
        });
    }
};

const createToken = async (tokenData) =>{
    let token = await jwt.sign(tokenData, Config.APP_CONSTANTS.SERVER.JWT_SECRET);
    return token;
};

module.exports = {
    tokenVerification:tokenVerification,
    createToken:createToken
};