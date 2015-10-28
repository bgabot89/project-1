//activates mongoose
var mongoose = require ("mongoose");
		Schema = mongoose.Schema; 
		//activates bcrypt
		bcrypt = require('bcrypt');
		//hashes password
		salt = bcrypt.genSaltSync(10);
		hash = bcrypt.hashSync('B4c0/\/', salt);

//defines user Schema
var userSchema = new Schema({
	user: String,
	passwordDigest: String
});

//creates a new user with a hashed password
userSchema.statics.createSecure = function (email, password, callback){

//declares a variable called UserModel into this, because 'this' changes for each callback
	var UserModel = this;
//hash password user enters
	bcrypt.genSalt(function (err,salt){
		console.log('salt: ', salt);
		bcrypt.hash(password,salt,function (err,hash) {
			//creates a new user and saves it to database
			UserModel.create({
				email: email,
				passwordDigest: hash
			}, callback);
		});
	});
};

//authenticate user when they login
userSchema.statics.authenticate = function (email, password, callback) {
	this.findOne({email:email}, function (err, foundUser){
		console.log(foundUser);
	if (!foundUser){
		console.log(foundUser + "cannot be found");
		callback ("no user can be found", null);	}
	else if (foundUser.checkPassword(password)) {
		callback (null, foundUser);
	} else {
		callback("error, password is invalid",null);
	}
});
};

//authenticate password 
userSchema.statics.checkPassword = function(password){
	return bcrypt.compareSync(password, this.passwordDigest);
};

//creates a model based on the schema
var User = mongoose.model('User', userSchema);

//export user model
module.exports= User;