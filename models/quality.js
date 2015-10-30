//activates mongoose
var mongoose = require ("mongoose");
		Schema = mongoose.Schema; 

		//defines user Schema
var qualitySchema = new Schema({
	entry: String,
});


//creates a new hero
qualitySchema.statics.createSecure = function(entry, callback) {

	var Qualitymodel = this;

//creates a new hero into the db
	 Qualitymodel.create({
        entry: entry
      }, callback);
};
//creates a model based on the schema
var Quality = mongoose.model('Quality', qualitySchema);

//export user model
module.exports= Quality;