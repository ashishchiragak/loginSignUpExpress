let SERVER = {
    JWT_SECRET_KEY_USER:'@#$123%',
    JWT_SECRET_KEY_ADMIN:'@#$124%',
    JWT_SECRET:'!@#675#$%^'
};

let SCOPE = {
    USER:'USER',
    ADMIN:'ADMIN',
};

let LINKS = {
    VERIFY_EMAIL: 'http://localhost:8000/user/verifyEmail?verifyEmailToken=',
    FORGOT_PASSWORD: 'http://localhost:8000/forget-password/',
};

let STATUSCODE = {
    BAD_REQUEST:400,
    INTERNAL_SERVER_ERROR:500,
    SUCCESS:200,
    UNAUTHORISED:401,
    CREATED:201
};

module.exports = {
    SERVER:SERVER,
    SCOPE:SCOPE,
    LINKS:LINKS,
    STATUSCODE:STATUSCODE,
};