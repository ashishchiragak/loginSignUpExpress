'use strict';

let Schema = Mongoose.Schema({
    isDeleted: {type: Boolean, default: false, required: true},
    isBlocked: {type: Boolean, default: false, required: true},
    isEmailVerified: {type: Boolean, default: false, required: true},

    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    password:{type:String,required:true},
    email:{type:String,required:true},
    verifyEmailToken:{type:String},
    token:[{
            deviceToken:{type:String},
            accessToken:{type:String},
            deviceType:{type:String},
    }]

},{
    timestamps:{
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    } // inserts createdAt and updatedAt
});
module.exports = Mongoose.model('users',Schema);