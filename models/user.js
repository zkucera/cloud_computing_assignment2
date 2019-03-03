var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt       = require('bcryptjs');


var UserSchema = new Schema({
    username: {type: String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true}
});

UserSchema.pre('save', function(next) {

    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')){
        return next();
    }

    // generate a salt
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    next();
});

UserSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};



module.exports = mongoose.model('User', UserSchema);