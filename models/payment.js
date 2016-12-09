var mongoose=require('mongoose')
  , Schema=mongoose.Schema;
  

var paymentcreditcardSchema = new Schema({
	user_id : {type : String},
	credit_cardnumber : {type: String},
	cc_image : {type : String},
	expire_date:{type : String},
	cvv : {type : String},
	postal : {type : String},
	country : {type : String}
});

var paymentbycard = mongoose.model('paymentbycard', paymentcreditcardSchema);


module.exports = {
  Payment: paymentbycard
};
