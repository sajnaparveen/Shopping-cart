const mongoose = require('mongoose');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    uuid: { type: String, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, trim: true, unique: true },
    mobileNumber: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], required: true, default: "user" }
}, {
    timestamps: true
})

userSchema.pre('save', function (next) {
    this.uuid = 'USER-' + crypto.pseudoRandomBytes(4).toString('hex').toLocaleUpperCase()
    next();
})
module.exports = mongoose.model('user', userSchema, 'user');