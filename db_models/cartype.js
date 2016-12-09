var mongoose=require('mongoose')
  , Schema=mongoose.Schema;


var cartypeSchema = new Schema({
	car_type : {type: String},
  description : {type: String},
  pickup_time : {type: String},
	deleted : {type : Boolean, default : false}
});

var cartype = mongoose.model('cartype', cartypeSchema);


module.exports = {
  Cars: cartype
};
