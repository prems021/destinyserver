var mongoose=require('mongoose')
  , Schema=mongoose.Schema;


var driverregSchema = new Schema({
	user_id : {type: String},
  phonenumber : {type: String},
  driver_rating: {type : Number},
  driver_image:{type: String},
  car_type : {type: String},
  city : {type: String},
  ref_code : {type: String},
  car_year : {type: String},
  car_company : {type: String},
  car_model : {type: String},
  car_ofdoors : {type: String},
  car_color : {type: String},
  legal_firstname : {type: String},
  middle_name : {type :String},
  legal_lastname : {type: String},
  ssn : {type: String},
  dob : {type: String},
  license_num : {type: String},
  license_state : {type: String},
  license_expire : {type: String},
  license_status : {type: Boolean, default :false},
  res_address_1 : {type: String},
  res_address_2 : {type: String},
  res_city : {type: String},
  res_state : {type: String},
  res_zipcode : {type: String},
  driver_longitude : {type: String},
  driver_latitude : {type: String},
  driver_socketid : {type :String},
  driver_status:{type:String, enum:['idle','on_mode','on_assign','on_drive','drive_complete'],default:'idle'}
});

var destinydrivers = mongoose.model('destinydrivers', driverregSchema);


module.exports = {
  Driver: destinydrivers
};


//58393d3cd090f000eb00c033-sony
//5836b54b2c506500eaf96d72-sonu
//5836b5412c506500eaf96d71-Sanal
