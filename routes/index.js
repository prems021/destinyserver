
var gcm = require('android-gcm');
var gcmObject = new gcm.AndroidGcm('AIzaSyBn_w6lr9_0kThF5qWaVXp9m9t7uJmi-fs');


var message = new gcm.Message({
    registration_ids: [''],
    data: {
        key1: 'key 1',
        key2: 'key 2'
    }
});




var account_sid = 'ACc02180f2ef34bd332826dde1f59835f7';
var auth_token = '3c75a3585a18c8fb3bd79be890e74794';
var client = require('twilio')(account_sid, auth_token);
var speakeasy = require('speakeasy');
var Register = require('../models/register').Register;
var Role = require('../models/role').Role;
var Location = require('../models/location').Location;
var Destiny = require('../models/destinyreg').Destiny;
var Payment = require('../models/payment').Payment;
var Pickup = require('../models/pickup').Pickup;
var Cars = require('../db_models/cartype').Cars;
var Driver = require('../models/driverreg').Driver;
var Adminpanel = require('../db_models/adminpanel').Adminpanel;
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var db = mongoose.connection;


//Function deg2rad
function deg2rad(deg) {
        return deg * (Math.PI/180)
      }

  /* Sorting */

      var sort_by = function(field, reverse, primer){
        var key = primer ?
       function(x) {return primer(x[field])} :
       function(x) {return x[field]};
          reverse = !reverse ? 1 : -1;
          return function (a, b) {
          return a = key(a), b = key(b), reverse * ((a < b) - (b < a));
        }
      }

//List Users
exports.users=function(req,res){
	Destiny.find({}, function(err, docs) {
    if(!err) {
     res.json(200, docs);
    } else {
      res.json(500, { message: err });
    }
  });
}


//Add roles
exports.addroles=function(req,res){
	var role_name=req.body.role_name;
	var is_deleted=req.body.is_deleted;
	var deleted_by=req.body.deleted_by;
	var deleted_on=req.body.deleted_on;
	var del_remark=req.body.del_remark;

	var newRole = new Role();
	newRole.role_name=role_name;
	newRole.is_deleted=is_deleted;
	newRole.deleted_by=deleted_by;
	newRole.deleted_on=deleted_on;
	newRole.del_remark=del_remark;
	newRole.save(function(err){
		if(!err)
		{
			res.json(200,{message: "Role added successfully"});
		}
		else
		{
			res.json(400,{message: "Role added failed"});
		}

	});
}


//Add user location details
exports.addlocation=function(req,res){
	var user_id=req.params.user_id;
	var latitude=req.body.latitude;
	var longitude=req.body.longitude;

	var newLocation =new Location();
	newLocation.user_id=user_id;
	newLocation.latitude=latitude;
	newLocation.longitude=longitude;
	newLocation.save(function(err){
		if(!err)
		{
			res.json(200,{message: "Location added successfully"});
		}
		else
		{
			res.json(400,{message: "Location added failed"});
		}
	});
}

//Destiny registration
// exports.destinyregistration=function(req,res){
//
//
// 	var code = () => Math.floor(1000 + Math.random() * 9000);
// 	var phonenumber=req.body.phonenumber;
//
// 	Destiny.findOne({phonenumber:phonenumber},function(err,doc){
// 		if(!err && !doc){
//
// 			//Sending message to the user using twilio
// 			client.sendSms({
//
// 		    to: newDestiny.phonenumber, // Any number Twilio can deliver to
// 		    from: '+12409790650', // A number you bought from Twilio and can use for outbound communication
// 		    body: 'Your Destiny varification code is :'+newDestiny.verify_code // body of the SMS message
//
// 			}, function(err, responseData) { //this function is executed when a response is received from Twilio
//
// 			    if (!err) {
//
// 						var newDestiny = new Destiny();
//
// 						newDestiny.phonenumber=phonenumber;
// 						newDestiny.verify_code=code();
// 						newDestiny.firstname="";
// 						newDestiny.lastname="";
// 						newDestiny.email="";
// 						newDestiny.profile_pic="";
// 						newDestiny.hometown="";
// 						newDestiny.fav_music="";
// 						newDestiny.about="";
// 						newDestiny.save(function(err){
// 							if(!err)
// 							{
// 			      			res.json(201,{status:"1",message: "Registration success"});
// 							}
// 							else{
// 								res.json(400,{status:"0",message: "Registrstion failed"});
// 							}
//
// 			      //console.log(responseData.from); // outputs "+14506667788"
// 			      //console.log(responseData.body); // outputs "word to your mother."
//
// 			    });
// 			});
// 		else{
// 			res.json(400,{status:"0",message: "Registrstion failed"});
// 		}
// 	});
// 		}
// 		else{
// 			res.json(403, {status:"0",message: "This phonenumber already exist"});
// 		}
// 	});
//
//
// }

//Destiny registration
exports.destinyregistration=function(req,res){
  var code = () => Math.floor(1000 + Math.random() * 9000);
	var phonenumber=req.body.phonenumber;
  var device_name=req.body.device_name;
  var device_token=req.body.device_token;

  if(device_name=='Android'){
    //var android=device_token;

    var newDestiny = new Destiny();

  			newDestiny.phonenumber=phonenumber;
  			newDestiny.verify_code=code();
  			newDestiny.firstname="";
  			newDestiny.lastname="";
  			newDestiny.email="";
  			newDestiny.profile_pic="";
  			newDestiny.hometown="";
  			newDestiny.fav_music="";
  			newDestiny.about="";
        newDestiny.android_token=device_token;
        newDestiny.ios_token="";

    Destiny.findOne({phonenumber:phonenumber},function(err,doc){
      if(!err && !doc){
        client.sendSms({
          to: newDestiny.phonenumber,
          from: '+12409790650',
          body: 'Your Destiny verification code is :'+newDestiny.verify_code
        },function(err, responseData){
          if (!err){
            newDestiny.save(function(err){
              if(!err)
  							{
  			      			res.json(200,{status:"1",message: "Registration success"});
  							}
  							else{
  								res.json(400,{status:"0",message: "Registrstion failed"});
  							}
            });
          }
        });
      }
      else{
        res.json(403, {status:"0",message: "This phonenumber already exist"});
      }
    });
  }
  else if(device_name=='Ios'){
    //var ios=device_token;
    var newDestiny = new Destiny();

  			newDestiny.phonenumber=phonenumber;
  			newDestiny.verify_code=code();
  			newDestiny.firstname="";
  			newDestiny.lastname="";
  			newDestiny.email="";
  			newDestiny.profile_pic="";
  			newDestiny.hometown="";
  			newDestiny.fav_music="";
  			newDestiny.about="";
        newDestiny.android_token="";
        newDestiny.ios_token=device_token;

    Destiny.findOne({phonenumber:phonenumber},function(err,doc){
      if(!err && !doc){
        client.sendSms({
          to: newDestiny.phonenumber,
          from: '+12409790650',
          body: 'Your Destiny verification code is :'+newDestiny.verify_code
        },function(err, responseData){
          if (!err){
            newDestiny.save(function(err){
              if(!err)
  							{
  			      			res.json(200,{status:"1",message: "Registration success"});
  							}
  							else{
  								res.json(400,{status:"0",message: "Registrstion failed"});
  							}
            });
          }
        });
      }
      else{
        res.json(403, {status:"0",message: "This phonenumber already exist"});
      }
    });
  }
}

//Number verification
exports.verifynumber=function(req, res)
	{
  var phonenumber=req.body.phonenumber;
  var verify_code=req.body.verify_code;
  Destiny.find({verify_code:verify_code,account_status:false,phonenumber:phonenumber},function(err,doc){
    if(!err && doc){

			res.json(200,{status:"1",message:"Number verified successfully"});
    }
    else
    {
      res.json(400,{status:"0",message:"Please enter a valid code"});
    }
  });
}

//Number verification
// exports.verifynumber=function(req, res){
//   var phone_number=req.body.phone_number;
//   var verify_code=req.body.verify_code;
//   Destiny.find({verify_code:verify_code,account_status:false,phonenumber:phone_number},function(err,doc){
//     if(!err && doc){
// 			res.json(200, {status:"1"doc});
// 			//var phone=doc.phonenumber;
//       // Destiny.update({phonenumber:phone_number},{$set:{account_status:true,verify_code:""}},function(err){
//       //   if(!err)
//       //       {
//       //         res.json(200, {status:"1",message: "Number verified Successfully..!!"});
// 			//
//       //       }
//       //   else
//       //       {
//       //         res.json(400, {status:"0",message: "Please enter a valid code!!"});
//       //       }
//       // });
//     }
//     else
//     {
//       res.json(403, {status:"0",message: "This phonenumber not exist!!"});
//     }
//   });
// }

// //NUmber verification
// exports.verifynumber=function(req, res)
// {
// 	var phonenum=req.body.phonenum;
//   var verify_code = req.body.verify_code;
//   Destiny.find({verify_code:verify_code,account_status:false,phonenumber:phonenum}, function(err, doc) {
//
//     var i;
//
//               if(doc.length > 0){
//                 for(i=0;i<doc.length;i++)
//                   {
//                      var phone=doc[i].phonenumber;
//
//                      Destiny.update({phonenumber:phone},{$set: {account_status:true}},function(err){
//                   if(!err)
//                   {
//                     res.json(200, {status:"1",message: "Number verified Successfully..!!"});
//
//                   }
//                   else
//                   {
//                      res.json(403, {status:"0",message: "Please enter a valid code!!"});
//                   }
//
//                });
//
//                 }
//
//               }
//
//                   else
//                   {
//                      res.json(403, {status:"0",message: "Please enter a valid code!!"});
//                   }
//
//    });
// }

//Destiny login
exports.logincheck=function(req,res){
	var phonenumber=req.params.phonenumber;
  var device_token=req.body.device_token;
  var device_name=req.body.device_name;
  if(device_name=='Android'){
    Destiny.findOne({phonenumber:phonenumber,account_status:true}, function(err, doc){
  		if(!err && doc){
        if(doc.android_token!=device_token){
          Destiny.update({phonenumber:phonenumber},{$set:{android_token:device_token}},function(err){
            if(!err){
              res.json(200,{message:"success"});
            }
            else{
              res.json(400,{message:"failed"});
            }
          });
        }
  			res.json(200,{
  				status:"1",
  				message:"login success",
  				_id:doc._id,
  				phonenumber:doc.phonenumber,
  				account_status:doc.account_status,
  				firstname:doc.firstname,
  				lastname:doc.lastname,
  				email:doc.email,
  				date_created:doc.date_created,
  				profile_pic:doc.profile_pic,
  				hometown:doc.hometown,
  				fav_music:doc.fav_music,
  				is_driver:doc.is_driver,
  				about:doc.about
  			});
  			//res.json(201,{message:"Hello"});
  		}
  		else{
  			res.json(400,{
  				status:"0",
  				message:"Number doesn't exist!! Please signup",
  				_id:"",
  				phonenumber:"",
  				account_status:"",
  				firstname:"",
  				lastname:"",
  				email:"",
  				date_created:"",
  				profile_pic:"",
  				hometown:"",
  				fav_music:"",
  				is_driver:"",
  				about:""
  			});
  		}

  	});
  }
  else if(device_name=='Ios'){
    Destiny.findOne({phonenumber:phonenumber,account_status:true}, function(err, doc){
  		if(!err && doc){
        if(doc.ios_token!=device_token){
          Destiny.update({phonenumber:phonenumber},{$set:{ios_token:device_token}},function(err){
            if(!err){
              res.json(200,{message:"success"});
            }
            else{
              res.json(400,{message:"failed"});
            }
          });
        }
  			res.json(200,{
  				status:"1",
  				message:"login success",
  				_id:doc._id,
  				phonenumber:doc.phonenumber,
  				account_status:doc.account_status,
  				firstname:doc.firstname,
  				lastname:doc.lastname,
  				email:doc.email,
  				date_created:doc.date_created,
  				profile_pic:doc.profile_pic,
  				hometown:doc.hometown,
  				fav_music:doc.fav_music,
  				is_driver:doc.is_driver,
  				about:doc.about
  			});
  			//res.json(201,{message:"Hello"});
  		}
  		else{
  			res.json(400,{
  				status:"0",
  				message:"Number doesn't exist!! Please signup",
  				_id:"",
  				phonenumber:"",
  				account_status:"",
  				firstname:"",
  				lastname:"",
  				email:"",
  				date_created:"",
  				profile_pic:"",
  				hometown:"",
  				fav_music:"",
  				is_driver:"",
  				about:""
  			});
  		}

  	});
  }

}

/*exports.logincheck=function(req,res){
	var code = () => Math.floor(1000 + Math.random() * 9000);
	var newcode=code();
	var phonenumber=req.params.phonenumber;
	Destiny.findOne({phonenumber:" "+phonenumber,account_status:true}, function(err, doc){
		if(!err && doc){
			client.sendSms({

		    to: phonenumber, // Any number Twilio can deliver to
		    from: '+12409790650', // A number you bought from Twilio and can use for outbound communication
		    body: 'Your Destiny varification code is :'+newcode // body of the SMS message

			}, function(err, responseData) { //this function is executed when a response is received from Twilio

			    if (!err) {
			        res.json(200,{user:doc,message:newcode});
			    }
			});
			//res.json(200,doc);
		}
		else{
			res.json(404,{message:"Account no found"});
		}

	});
}*/

//User details
exports.add_details=function(req,res){
	var phonenumber=req.params.phonenumber;
	var firstname=req.body.firstname;
	var lastname=req.body.lastname;
	var email=req.body.email;

	Destiny.findOne({phonenumber:phonenumber},function(err,doc){

		if(!err && doc){

			//res.json(200, {message : "success"+doc.phonenumber});
			//var phone=doc[i].phonenumber;

                     Destiny.update({phonenumber:doc.phonenumber},{$set: {firstname:firstname,lastname:lastname,email:email,account_status:true}},function(err){
                  if(!err)
                  {
                    //res.json(200, {status:"1",message: "Success..!!",Accounts:doc});
										res.json(200,{
											status:"1",
											message: "Success..!!",
											_id:doc._id,
											phonenumber:doc.phonenumber,
											account_status:doc.account_status,
											firstname:doc.firstname,
											lastname:doc.lastname,
											email:doc.email,
											date_created:doc.date_created,
											profile_pic:doc.profile_pic,
											hometown:doc.hometown,
											fav_music:doc.fav_music,
											about:doc.about
										});

                  }
                  else
                  {
                     //res.json(403, {status:"0",message: "Error!!",Accounts:{doc}});
										 res.json(400,{
 											status:"0",
 											message: "Error!!",
 											_id:"",
 											phonenumber:"",
 											account_status:"",
 											firstname:"",
 											lastname:"",
 											email:"",
 											date_created:"",
 											profile_pic:"",
 											hometown:"",
 											fav_music:"",
 											about:""
 										});
                  }

               });
		}
		else{
			//res.json(400,{message:"error"});
			res.json(403,{
			 status:"0",
			 message: "Error!!",
			 _id:"",
			 phonenumber:"",
			 account_status:"",
			 firstname:"",
			 lastname:"",
			 email:"",
			 date_created:"",
			 profile_pic:"",
			 hometown:"",
			 fav_music:"",
			 about:""
		 });
		}
	});
}

//Update profile pic
exports.updatepic=function(req,res){
	var id=req.params.id;
	var tmp_path = req.files.profile_pic.path;
    var image_name1=req.files.profile_pic.name;
    var chunks1 = image_name1.split(".");
    var end1 =chunks1[chunks1.length - 1];


    var text1 = "";
    var possible1 = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for( var i=0; i < 5; i++ )
        text1 += possible1.charAt(Math.floor(Math.random() * possible1.length));

    var target_path = './uploads/' + text1 + '.' + end1;

      fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        fs.unlink(tmp_path, function() {
            if (err) throw err;
        });
    });

		var image_path= text1 + '.' + end1;

  Destiny.findById(id, function(err, doc) {
      if(!err && doc) {
        doc.profile_pic = image_path;

        doc.save(function(err) {
          if(!err) {
            res.json(200, {status:"1",Profileimage:doc.profile_pic});
          } else {
            res.json(500, {status:"0",message: "Could not update Profile picture . " + err});
          }
        });
      } else if(!err) {
        res.json(400, { status:"0",message: "Could not find profile."});
      } else {
        res.json(500, { status:"0",message: "Could not update  Profile picture ." + err});
      }
    });

}

//Update user details
exports.updatedetails=function(req,res){
	var id=req.params.id;
	var hometown=req.body.hometown;
	var fav_music=req.body.fav_music;
	var about=req.body.about;

	Destiny.findById(id,function(err,doc){
		if(!err && doc){
		doc.hometown=hometown;
		doc.fav_music=fav_music;
		doc.about=about
		doc.save(function(err){
			if(!err){
				res.json(200, {status:"1",message:"Details updated success"});
			}
			else{
				res.json(400, {status:"0",message:"Couldn't fint the profile"});
			}
		});

		}
		else{
			res.json(500,{status:"0",message:"Could not update"+err});
		}

	});
}





var message = new gcm.Message({
    registration_ids: ['x', 'y', 'z'],
    data: {
        key1: 'key 1',
        key2: 'key 2'
    }
});


//Edit email id
exports.editemail=function(req,res){
	var id=req.params.id;
	var email=req.body.email;

	Destiny.findById(id,function(err,doc){
		if(!err && doc){
      var iostoken=doc.ios_token;
      var androidtoken=doc.android_token;
      console.log(androidtoken);
			doc.email=email;
			doc.save(function(err){
				if(!err){
         
                   
													var message = new gcm.Message({
															registration_ids: [androidtoken],
															data: {
																
                                        Message : 'Email Updated',
                                        badge : null,
                                       sound : null,
                                        payload : null,
                                        title: 'test'

															}
													});
                    
                         gcmObject.send(message, function(err, response) {
                               	if(!err){

                                     	console.log('res==',response);

																 }
                                else{

																	console.log('err==',err);
																}



												 });
				}
				else{
					res.json(400,{status:"0",message:"Updation failed "+err})
				}
			});
		}
		else{
			res.json(401,{status:"0",message:"Account not found "+err});
		}
	});

}

//Adding credit card details
exports.addcreditcard=function(req,res){
	var user_id=req.params.user_id;
	var credit_cardnumber=req.body.credit_cardnumber;
	var expire_date=req.body.expire_date;
	var cvv=req.body.cvv;
	var postal=req.body.postal;
	var country=req.body.country;

	var tmp_path = req.files.cc_image.path;
    var image_name1=req.files.cc_image.name;
    var chunks1 = image_name1.split(".");
    var end1 =chunks1[chunks1.length - 1];


    var text1 = "";
    var possible1 = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for( var i=0; i < 5; i++ )
        text1 += possible1.charAt(Math.floor(Math.random() * possible1.length));

    var target_path = './uploads/creditcard/' + text1 + '.' + end1;

      fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        fs.unlink(tmp_path, function() {
            if (err) throw err;
        });
    });

	var image_path= text1 + '.' + end1;

	Payment.findOne({user_id:user_id},function(err,doc){
		if(!err && doc){
			res.json(202,{message:"You already entered the card details"})
		}
		else{

	var newPayment = new Payment();

	newPayment.user_id=user_id;
	newPayment.credit_cardnumber=credit_cardnumber;
	newPayment.cc_image=image_path;
	newPayment.expire_date=expire_date;
	newPayment.cvv=cvv;
	newPayment.postal=postal;
	newPayment.country=country;


	newPayment.save(function(err){
		if(!err){
			res.json(200,{status:"1",message:"Card details added success"});
		}
		else{
			res.json(400,{status:"0",message:"Failed : "+err});
		}
	});
		}
	});
}

//Edit credit card details
exports.editcreditcard=function(req,res){
	var user_id=req.params.user_id;
	var credit_cardnumber=req.body.creditcard;
	var expire_date=req.body.expire_date;
	var cvv=req.body.cvv;
	var postal=req.body.postal;
	var country=req.body.country;

	var tmp_path = req.files.cc_image.path;
    var image_name1=req.files.cc_image.name;
    var chunks1 = image_name1.split(".");
    var end1 =chunks1[chunks1.length - 1];


    var text1 = "";
    var possible1 = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for( var i=0; i < 5; i++ )
        text1 += possible1.charAt(Math.floor(Math.random() * possible1.length));

    var target_path = './uploads/creditcard/' + text1 + '.' + end1;

      fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        fs.unlink(tmp_path, function() {
            if (err) throw err;
        });
    });

	var image_path= text1 + '.' + end1;

	Payment.findOne({user_id:user_id},function(err,doc){
		if(!err && doc){

			Payment.update({user_id:doc.user_id},{$set: {user_id:user_id,credit_cardnumber:credit_cardnumber,cc_image:image_path,expire_date:expire_date,cvv:cvv,postal:postal,country:country}},function(err){
				if(!err){
					res.json(200,{message:"Updation sucess"});
				}
				else{
					res.json(400,{message:"Updation failed "+err});
				}
			});
		}
	});
}

//Add pickup
exports.addpickup= function(req,res){
  var user_id=req.params.user_id;
	var lat1=req.params.lat1;
	var lon1=req.params.lon1;
	var resultSet=[];
	var user_image=req.body.user_image;
	var current_location=req.body.current_location;
	var destination=req.body.destination;
	var dest_longitude=req.body.dest_longitude;
	var dest_latitude=req.body.dest_latitude;
	var price_estimate=req.body.price_estimate;
  var car_type=req.body.car_type;

      var newPickup =new Pickup();
			newPickup.user_id=user_id;
			newPickup.user_image=user_image;
			newPickup.current_location=current_location;
			newPickup.cl_longitude=lon1;
			newPickup.cl_latitude=lat1;
			newPickup.destination=destination;
			newPickup.dest_longitude=dest_longitude;
			newPickup.dest_latitude=dest_latitude;
			newPickup.price_estimate=price_estimate;
      newPickup.car_type=car_type;
      newPickup.driver_id="";

      Pickup.findOne({user_id:user_id},function(err,doc){
        if(!err && !doc){
          newPickup.save(function(err){
    				if(!err){
    					res.json(200,{status:"1",message:"Your pickup request added success"});
    					// Driver.find({driver_status:'on_mode'}, function(err, docs) {
    					// 	if(err)
    				  //   {
    				  //     res.json(500, {message:err});
    				  //   }
    					// 		//var test=[];
    					// 		for(var m=0; m<docs.length; m++){
    				  //     //   test.push((docs[m]._id));
    				  //     var auxRes = {};
    				  //     auxRes._id = docs[m]._id;
    				  //     auxRes.legal_firstname = docs[m].legal_firstname;
    				  //     auxRes.phonenumber = docs[m].phonenumber;
    				  //     auxRes.dob = docs[m].dob;
    				  //     auxRes.driver_image = docs[m].driver_image;
    				  //     auxRes.driver_rating = docs[m].driver_rating;
    				  //     auxRes.driver_longitude = docs[m].driver_longitude;
    				  //     auxRes.driver_latitude = docs[m].driver_latitude;
              //
    				  //     var lat2=docs[m].driver_latitude;
    				  //     var lon2=docs[m].driver_longitude;
              //
    				  //     var R = 6371; // Radius of the earth in km
    				  //     var dLat = deg2rad(lat2-lat1);
    				  //     var dLon = deg2rad(lon2-lon1);
    				  //     var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *  Math.sin(dLon/2) * Math.sin(dLon/2);
    				  //     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    				  //     var d = R * c;
    					// 		//var d=1;
    				  //     auxRes.Distance=d;
    				  //     resultSet.push(auxRes);
    					// 		}
    					// 		var sorted_distance= resultSet.sort(sort_by('Distance', true, parseInt));
    				  //     res.json(200, sorted_distance);
    				  // });
    				}
    				else{
    					res.json(400,{status:"0",message:"request failed "+err});
    				}
    			});
        }
        else{
          res.json(402,{status:"0",message:"Already a request pending"})
        }
      });


}

//Get ride history
exports.ridehistory=function(req,res){
	var user_id=req.params.user_id;
	Pickup.find({user_id:user_id},function(err,docs){
		if(!err){
			res.json(200,{status:1,Ridehistory:docs});
		}
		else{
			res.json(404,{status:0,message: err});
		}
	});
}

//Get country codes
exports.code=function(req,res){
	var countrycodes=fs.readFileSync("countrycode.txt");
	var jsonContent=JSON.parse(countrycodes);
	res.json(200,{Codes:jsonContent});
}

//Add cartypes
exports.addcartype=function(req,res){
	var car_type=req.body.car_type;
	var description=req.body.description;
	var pickup_time=req.body.pickup_time;

	var newCartype=new Cars();
	newCartype.car_type=car_type;
	newCartype.description=description;
	newCartype.pickup_time=pickup_time;


	newCartype.save(function(err){
		if(!err){
			res.json(200,{status:"1",message:"Added Success"});
		}
		else{
			res.json(402,{status:"0",message:"failed "+err});
		}
	});
 }

//Listing the car types
exports.listcartype=function(req,res){
	Cars.find(function(err,docs){
		if(!err && docs){
			res.json(200,{status:1,Cartypes:docs});
		}
		else{
			res.json(400,{status:0,message:err});
		}
	});
}

//Destiny Driver Registration step1
exports.driverreg_step1=function(req,res){
	var user_id=req.params.user_id;
	var city=req.body.city;
	var ref_code=req.body.ref_code;
	var phonenumber=req.body.phonenumber;
	var driver_image=req.body.driver_image;

	Driver.findOne({user_id:user_id,license_status:true},function(err,doc){
		if(!err && !doc){
					var newDriver = new Driver();
					newDriver.user_id=user_id;
					newDriver.city=city;
					newDriver.ref_code=ref_code;
					newDriver.phonenumber=phonenumber;
					newDriver.car_type="";
					newDriver.car_year="";
					newDriver.car_company="";
					newDriver.car_model="";
					newDriver.car_ofdoors="";
					newDriver.car_color="";
					newDriver.legal_firstname="";
					newDriver.middle_name="";
					newDriver.legal_lastname="";
					newDriver.ssn="";
					newDriver.dob="";
					newDriver.license_num="";
					newDriver.license_state="";
					newDriver.license_expire="";
					newDriver.license_status="";
					newDriver.res_address_1="";
					newDriver.res_address_2="";
					newDriver.res_city="";
					newDriver.res_state="";
					newDriver.res_zipcode="";
					newDriver.driver_longitude="";
					newDriver.driver_latitude="";
					newDriver.driver_rating=0;
					newDriver.driver_image=driver_image;
					newDriver.driver_socketid="";

					newDriver.save(function(err){
						if(!err){
							res.json(200,{status:"1",message:"Driver added success"});
						}
						else{
							res.json(400,{status:"0",message:"Failed"});
						}
					});
				}
		else{
			res.json(402,{status:"0",message:"Driver already exist"});
		}
	});


}

//Destiny Driver Registration step2
exports.driverreg_step2=function(req,res){
	var user_id=req.params.user_id;
	var car_year=req.body.car_year;
	var car_company=req.body.car_company;
	var car_model=req.body.car_model;
	var car_ofdoors=req.body.car_ofdoors;
	var car_color=req.body.car_color;

	Driver.findOne({user_id:user_id},function(err,doc){
		if(!err && doc){
			Driver.update({user_id:doc.user_id},{$set: {car_year:car_year,car_company:car_company,car_model:car_model,car_ofdoors:car_ofdoors,car_color:car_color}},
				function(err){
					if(!err){
						res.json(200,{status:"1",message:"Driver registration step2 success"});
					}
					else{
						res.json(400,{status:"0",message:"Driver registration step2 failed"});
					}
				});
		}
	});
}

//Destiny Driver Registration step3
exports.driverreg_step3=function(req,res){
	var user_id=req.params.user_id;
	var legal_firstname=req.body.legal_firstname;
	var middle_name=req.body.middle_name;
	var legal_lastname=req.body.legal_lastname;
	var ssn=req.body.ssn;
	var dob=req.body.dob;
	var license_num=req.body.license_num;
	var license_state=req.body.license_state;
	var license_expire=req.body.license_expire;
	var res_address_1=req.body.res_address_1;
	var res_address_2=req.body.res_address_2;
	var res_city=req.body.res_city;
	var res_state=req.body.res_state;
	var res_zipcode=req.body.res_zipcode;

	Driver.findOne({user_id:user_id},function(err,doc){
		if(!err && doc){
			Driver.update({user_id:doc.user_id},{$set: {legal_firstname:legal_firstname,middle_name:middle_name,legal_lastname:legal_lastname,ssn:ssn,dob:dob,license_num:license_num,license_state:license_state,license_expire:license_expire,res_address_1:res_address_1,res_address_2:res_address_2,res_city:res_city,res_state:res_state,res_zipcode:res_zipcode}},
				function(err){
					if(!err){
						client.sendSms({
							to: doc.phonenumber,
        			from: '+12409790650',
        			body: 'To complete your Driver Registration please contact us: Destiny HelpDesk:+12409790650'
						},function(err, responseData){
							if(!err){
								res.json(200,{status:"1",message:"Driver registration step3 success"});
							}
						});
					}
					else{
						res.json(400,{status:"0",message:"Driver registration step3 failed"});
					}
				});
		}
	});
}

//Listing drivers
exports.driverlist=function(req,res){
	Driver.find(function(err,docs){
		if(!err){
			res.json(200,docs);
		}
		else{
			res.json(400,{message:"error"});
		}
	});
}

//Ridehistory Listing
exports.getpickuplist=function(req,res){
	Pickup.find(function(err,docs){
		if(!err){
			res.json(200,docs);
		}
		else{
			res.json(400,{message:"error"});
		}
	});
}

//Enabling the drivermode
exports.drivermodeon=function(req,res){
	var user_id=req.params.user_id;
	var driver_longitude=req.body.driver_longitude;
	var driver_latitude=req.body.driver_latitude;
	Driver.findOne({user_id:user_id},function(err,doc){
		if(!err && doc){
			Driver.update({user_id:doc.user_id},{$set: {driver_status:'on_mode',driver_longitude:driver_longitude,driver_latitude:driver_latitude}},function(err){
				if(!err){
					res.json(200,{
						status:"1",
						message:"Drivermode activated"
				});
				}
				else{
					res.json(400,{message:"Error!!"});
				}
			});
		}
	});

}

//Disabling the drivermode
exports.drivermodeoff=function(req,res){
	var user_id=req.params.user_id;
	Driver.findOne({user_id:user_id},function(err,doc){
		if(!err && doc){
			Driver.update({user_id:doc.user_id},{$set:{driver_status:'idle',driver_longitude:"",driver_latitude:""}},function(err){
				if(!err){
					res.json(200,{status:"1",message:"Deactivation success"});
				}
				else{
					res.json(400,{status:"0",message:"Deactivation failed"});
				}
			});
		}
	});

}

//Single driver details
exports.singledriverdetails=function(req,res){
	var user_id=req.params.user_id;
	Driver.findOne({user_id:user_id},function(err,doc){
		if(!err && doc){
			res.json(200,doc);
		}
		else{
			res.json(400,{message:"Error"});
		}
	});
}

//Adding adminpanel users
exports.addadminusers=function(req,res){
	var firstname=req.body.firstname;
	var lastname=req.body.lastname;
	var username=req.body.username;
	var password=req.body.password;
	var is_admin=req.body.is_admin;

	var newAdminpanel=new Adminpanel();
	newAdminpanel.firstname=firstname;
	newAdminpanel.lastname=lastname;
	newAdminpanel.username=username;
	newAdminpanel.password=password;
	newAdminpanel.is_admin=is_admin;
	newAdminpanel.save(function(err){
		if(!err){
			res.json(200,{message:"Success"});
		}
		else{
			res.json(400,{message:"Failed"});s
		}
	});
}

//Get the nearest drivers
exports.getnearestdriver=function(req,res){
	var lat1=req.params.lat1;
	var lon1=req.params.lon1;
	var resultSet=[];
	Driver.find({driver_status:'on_mode'}, function(err, docs) {
		if(err)
    {
      res.json(500, {message:err});
    }
			//var test=[];
			for(var m=0; m<docs.length; m++){
      //   test.push((docs[m]._id));
      var auxRes = {};
      auxRes._id = docs[m]._id;
      auxRes.legal_firstname = docs[m].legal_firstname;
      auxRes.phonenumber = docs[m].phonenumber;
      auxRes.dob = docs[m].dob;
      auxRes.driver_image = docs[m].driver_image;
      auxRes.driver_rating = docs[m].driver_rating;
      auxRes.driver_longitude = docs[m].driver_longitude;
      auxRes.driver_latitude = docs[m].driver_latitude;

      var lat2=docs[m].driver_latitude;
      var lon2=docs[m].driver_longitude;

      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);
      var dLon = deg2rad(lon2-lon1);
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *  Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
			//var d=1;
      auxRes.Distance=d;
      resultSet.push(auxRes);
			}
			var sorted_distance= resultSet.sort(sort_by('Distance', true, parseInt));
      res.json(200, sorted_distance);
  });
}

//Sending request to driver
// exports.sendrequest=function(req,res){
//   var user_id=req.params.user_id;
//   var driver_id=req.params.driver_id;
//   Pickup.findOne({user_id:user_id,request_date:Date.Now});
// }

//Approve driver
exports.driverapprove=function(req,res){
  var _id=req.body._id;
  var car_type=req.body.car_type;
  var user_id=req.body.user_id;
  Driver.findOne({_id:_id,license_status:false},function(err,doc){
    if(!err && doc){
      //console.log("inside if loop");
      Driver.update({_id:doc._id},{$set:{license_status:true,car_type:car_type}},function(err){
        if(!err){
          Destiny.update({_id:user_id},{$set:{is_driver:true}},function(err){
            if(!err){
            res.json(200,{message:"Approved success"});
            }
          });
        }
        else{
          res.json(400,{message:"failed"});
        }
      });
    }
  });
}

//Suspend driver
exports.driversuspend=function(req,res){
  var driver_id=req.params.driver_id;
  Driver.findOne({_id:driver_id,license_status:true},function(err,doc){
    if(!err && doc){
      Driver.update({_id:doc._id},{$set:{license_status:false}},function(err){
        if(!err){
          res.json(200,{message:"Suspend success"});
        }
        else{
          res.json(400,{message:"failed"});
        }
      });
    }
  });
}

//Suspend user
exports.usersuspend=function(req,res){
  var _id=req.params._id;
  Destiny.findOne({_id:_id,is_suspend:false},function(err,doc){
    if(!err && doc){
      Destiny.update({_id:doc._id},{$set:{is_suspend:true}},function(err){
        if(!err){
          res.json(200,{message:"Suspend success"});
        }
        else{
          res.json(400,{message:"failed"});
        }
      });
    }
  });
}

//Approve user
exports.userapprove=function(req,res){
  var _id=req.params._id;
  Destiny.findOne({_id:_id,is_suspend:true},function(err,doc){
    if(!err && doc){
      Destiny.update({_id:doc._id},{$set:{is_suspend:false}},function(err){
        if(!err){
          res.json(200,{message:"Approve success"});
        }
        else{
          res.json(400,{message:"failed"});
        }
      });
    }
  });
}

//Inner joint test
// exports.innerjointest=function(req,res){
//   Destiny.aggregrate([{
//     $lookup: {
//             from: Pickup,
//             localField: "user_id",
//             foreignField: "_id",
//             as: "test_table"
//         }
// }],function(err,docs){
//   if(!err && docs){
//     res.json(200,docs);
//   }
//   else{
//     res.json(400,{message:"Inner join failed"});
//   }
// });
//
// }

//Updating device token
exports.updatetoken=function(req,res){
  var id=req.params.id;
  var device_name=req.body.device_name;
  var device_token=req.body.device_token;

  if(device_name=='Android'){
    Destiny.findById(id,function(err,doc){
  		if(!err && doc){
  			doc.android_token=device_token;
  			doc.save(function(err){
  				if(!err){
  					res.json(200,{status:"1",message:"token updated"});
  				}
  				else{
  					res.json(400,{status:"0",message:"Updation failed "+err})
  				}
  			});
  		}
  		else{
  			res.json(401,{status:"0",message:"Account not found "+err});
  		}
  	});
  }
  else if(device_name=='Ios'){
    Destiny.findById(id,function(err,doc){
  		if(!err && doc){
  			doc.ios_token=device_token;
  			doc.save(function(err){
  				if(!err){
  					res.json(200,{status:"1",message:"token updated"});
  				}
  				else{
  					res.json(400,{status:"0",message:"Updation failed "+err})
  				}
  			});
  		}
  		else{
  			res.json(401,{status:"0",message:"Account not found "+err});
  		}
  	});
  }
}
