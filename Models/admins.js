'use strict';

const Admins = new Mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    fullName: {type: String},
    email: {type: String, trim: true, index: true, required: true},
    password: {type: String, required: true},
    phoneNo: {type: String},
    countryCode: {type: String},
    accessToken: [{type: String, trim: true, unique: true, sparse: true}],
    deviceToken: [{type: String, trim: true, unique: true, sparse: true}],
    superAdmin: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false, required: true},
    isBlocked: {type: Boolean, default: false, required: true},
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    } // inserts createdAt and updatedAt
});

module.exports = Mongoose.model('Admins', Admins);