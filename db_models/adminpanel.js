var mongoose=require('mongoose')
  , Schema=mongoose.Schema;


var AdminSchema = new Schema({
	firstname : {type : String},
  lastname : {type : String},
  username : {type : String},
  password : {type : String},
  is_admin : {type : Boolean,default : false}
});

//var users = module.exports = mongoose.model('Users',registerSchema);

var admin = mongoose.model('admin', AdminSchema);


module.exports = {
  'secret': 'destinytripapp',
  Adminpanel: admin
};
