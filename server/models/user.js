const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

const UserSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    name: String,
    password: String,
    picture: String,
    isSeller: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
    address: {
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        country: String,
        postCode: String
    },
    created: {type: Date, default: Date.now()}
});

UserSchema.pre('save', function(next){
    let user = this;

    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function (err, hash) { // data , salt, progress, callback function
        if(err) return next(err);
        user.password = hash;
        next();
    });

});

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.gravatar = function (size) {
    if(!this.size) size = 200;
    if(!this.email) return `http://gravatar.com/avatar/?s=${size}&d=retro`;
    const md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return `http://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

module.exports = mongoose.model('User', UserSchema);