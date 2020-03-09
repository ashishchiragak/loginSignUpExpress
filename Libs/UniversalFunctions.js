let bcrypt = require('bcryptjs');


function hashString(string) {
    return bcrypt.hashSync(string, Config.APP_CONSTANTS.SERVER.SALT)
}

function compareHash(stingA,stringB){
    console.log(stingA,stringB,'stingA,stringB',bcrypt.compareSync(stingA, stringB));
    console.log(bcrypt.hashSync(stingA, Config.APP_CONSTANTS.SERVER.SALT));
    return bcrypt.compareSync(stingA, stringB)
}

const validateSchema = (data, schema, options) => {
    return new Promise((resolve, reject) => {
        Joi.validate(data, schema, options, (err, value) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(value);
            }
        });
    });
}

module.exports = {
    hashString:hashString,
    compareHash:compareHash,
    validateSchema:validateSchema
}