var mongoose=require('mongoose')
  , Schema=mongoose.Schema;


var destinylogSchema = new Schema({
	user_id : {type : String},
  ride_date : {type :String},
  ride_source : {type : String},
  ride_destination :{type :String},
  ride_driver_id :{type :String},
  ride_cost :{type:String},
  ride_rating :{type:String},
  rating_remark :{type:String},
  payment_mode :{type :String,enum:['creditcard','paypal','debitcard'],default:'creditcard'},
  
});

var destiny_log = mongoose.model('destiny_log', destinylogSchema);


module.exports = {
  Log: destiny_log
};
