var mongoose=require('mongoose')
  , Schema=mongoose.Schema;


var pickupSchema = new Schema({
	user_id : {type : String},
  user_image :{type :String},
	current_location : {type : String},
	cl_longitude : {type : String},
	cl_latitude : {type : String},
	destination :{type : String},
	dest_longitude : {type : String},
	dest_latitude : {type : String},
	price_estimate : {type : String},
  request_date : {type: Date, required: true, default: Date.now},
	//pickup_status : {type : Boolean, default : false},
  car_type : {type : String},
  driver_id:{type:String}
});

var pickup = mongoose.model('pickup', pickupSchema);


module.exports = {
  Pickup: pickup
};
