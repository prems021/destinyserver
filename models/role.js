var mongoose=require('mongoose')
  , Schema=mongoose.Schema;
  

var roleSchema = new Schema({
	role_name : {type : String},
	is_deleted : {type : Number},
	deleted_by : {type : String},
	deleted_on : {type : Date},
	del_remark : {type : String}
});

//var users = module.exports = mongoose.model('Users',registerSchema);

var roles = mongoose.model('roles', roleSchema);


module.exports = {
  Role: roles
};