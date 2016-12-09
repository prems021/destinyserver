var mongoose=require('mongoose')
  , Schema=mongoose.Schema;


var citySchema = new Schema({
	city_name : {type: String},
	city_longitude : {type : String},
	city_latitude : {type : String}
	}

});

var cities = mongoose.model('cities', citySchema);


module.exports = {
  Cities: cities
};
