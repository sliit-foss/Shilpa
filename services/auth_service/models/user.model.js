'use strict'

// Dependencies
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type:String, lowercase:true, required:true, unique:true},
    password: {type:String, required:true},
    name: {type:String, required:true},
    email: {type:String, lowercase:true, required:true, unique:true},
    permission: {type:String, required:true},
    studentId: {type:String},
    class: {type:String},
    level: {type:String}
});

// Mongoose pre hook is used to hash the password before saving it in the database.
UserSchema.pre('save', function (next) {
    var user = this;

    bcrypt.hash(user.password, null, null, function (err, hash) {

        if (err)
            return next(err);

        user.password = hash;
        next();

    });
});

// This method is used to compare the two passwords when a user logs in.
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.validateStudent = function() {

    if(this.permission == "student") {

        if (this.studentId == null || this.studentId == "") {

            return false;

        } else {

            return true;

        }
    } else {

        return true;

    }
}

module.exports = mongoose.model('User',UserSchema);

