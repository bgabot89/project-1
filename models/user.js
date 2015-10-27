//activates mongoose
var mongoose = require ("mongoose");
		Schema = mongoose.Schema; 


mongoose.connect( process.env.MONGOLAB_URI ||
                      process.env.MONGOHQ_URL || 
                      "localhost:3000" 

//defines user Schema
var userSchema = new Schema({
	user: String,
	passwordDigest: String
});

//creates a new user with a hashed password
userSchema.statics.createSecure = function (email, password, callback){

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

//creates a model based on the schema
var User = mongoose.model('User', userSchema);

//export user model
module.exports= User;