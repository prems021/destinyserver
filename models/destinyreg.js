var mongoose=require('mongoose')
  , Schema=mongoose.Schema;


var destinyregSchema = new Schema({
	phonenumber : {type: String},
  android_token:{type:String},
  ios_token:{type:String},
	verify_code : {type : String},
	account_status :{type : Boolean, default : false},
	firstname : {type : String},
	lastname : {type : String},
	email : {type : String},
	date_created : {type: Date, required: true, default: Date.now},
	profile_pic : {type :String},
	hometown : {type : String},
	fav_music : {type :String},
	about : {type :String},
  is_driver :{type :Boolean, default : false},
  is_suspend:{type:Boolean, default:false},
  user_status:{type:String, enum:['idle','on_req','on_ride','on_pay','ride_complete'],default:'idle'}
});

var destinyusers = mongoose.model('destinyusers', destinyregSchema);


module.exports = {
  Destiny: destinyusers
};
