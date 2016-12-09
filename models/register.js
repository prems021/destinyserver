var mongoose=require('mongoose')
  , Schema=mongoose.Schema;
  

var registerSchema = new Schema({
	email : {type: String},
	password : {type : String},
	firstname : {type :String},
	lastname : {type :String},
	mobilenumber : {type: String},
	language : {type : String},
	credit_cardno :{type :String},
	cvv :{type : String},
	card_expmonth : {type : String},
	card_expyear : {type :String},
	postalcode :{type : String},
	role_id: {type : String},
	promocode : {type :String},
	isblocked : {type : Number},
	blockedadminid :{type :String},
	blocked_date :{type : Date},
	remark : {type : String},
	online_status : {type : Number},
	user_type :{type : String}
});

var users = mongoose.model('users', registerSchema);


module.exports = {
  Register: users
};