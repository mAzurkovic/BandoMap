var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String,
        accepted     : Boolean
    },
    favoritedSpots: { Object },
    build: {
      frame: String,
      esc: String,
      motors: String,
      fc: String,
      camera: String,
      vtx: String,
      rx: String,
      hasSet: Boolean
    }

});

// Instance methods
userSchema.methods.add = function(accepted, callback){
    this.accepted = accepted;
    return this.save(callback);
}

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
