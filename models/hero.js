//activates mongoose
var mongoose = require ("mongoose");
		Schema = mongoose.Schema; 

		//defines hero Schema
var heroSchema = new Schema({
	input: String
});

//

//creates a new hero
heroSchema.statics.createSecure = function(input, callback) {

	var Heromodel = this;

//creates a new hero into the db
	 Heromodel.create({
        input: input
      }, callback);
};
//creates a model based on the schema
var Hero = mongoose.model('Hero', heroSchema);

//export user model
module.exports= Hero;