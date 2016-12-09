var mongoose=require('mongoose')
  , Schema=mongoose.Schema;
  

var locationSchema = new Schema({
	user_id :{type :String},
	latitude :{type : String},
	longitude :{type : String},
	date_created  : { type: Date, required: true, default: Date.now }
});

var locations = mongoose.model('locations', locationSchema);


module.exports = {
  Location: locations
};