var multipart = require('connect-multiparty');
var cors=require('cors');
var express=require('express');
var app=require('express')();
var http=require('http').Server(app);
var io=require('socket.io')(http);
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var session=require('express-session');
var fs=require('fs');
var util=require('util');
var path=require('path');
var morgan=require('morgan');
var jwt = require('jwt-simple');
var config = require('./config');
var routes=require('./routes');
var index = require('./routes/index');
var Adminpanel = require('./db_models/adminpanel').Adminpanel;
var Driver = require('./models/driverreg').Driver;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());

http.listen(8080,function(){
	console.log('listening to port 8080');
});


//MongoDB Connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://destiny:destiny@jello.modulusmongo.net:27017/xomu9xuH');


app.set('superSecret', config.secret);
app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/uploads/'));
app.use(express.static(__dirname + '/uploads/creditcard'));
app.use(morgan('dev'));

app.get('/',function(req,res)
{
	res.send('hello ashan');
});


//app.post('/register',index.register);//user register
app.get('/listusers',index.users);//listing users
app.post('/roles',index.addroles);//Manage roles
app.post('/track/:id',index.addlocation);//User location details
app.post('/destinyreg',index.destinyregistration);//User registration using phone number
app.post('/verifynum',index.verifynumber);//verifying the code
app.post('/login/:phonenumber',index.logincheck);//Destiny login
app.post('/userdetails/:phonenumber',index.add_details);//adding details
app.post('/updatepic/:id',multipart(),index.updatepic);//Updating profile pic
app.post('/updatedetails/:id',index.updatedetails);//update user details
app.post('/editemail/:id',index.editemail);//Edit user emailid
app.post('/addcreditcard/:user_id',multipart(),index.addcreditcard);//Add creditcard
app.post('/editcreditcard/:user_id',multipart(),index.editcreditcard);//Edit credit card
app.post('/addpickup/:user_id/:lat1/:lon1',index.addpickup);//add pickup
app.get('/ridehistory/:user_id',index.ridehistory);//Get ride history
app.get('/countrycode',index.code);//List country codes

//Geo location using socket
app.get('/currentlocation',function(req,res)
  {
  res.send('Realtime Location');
  });

  //Realtime location tracking
  var users=[];

  //Users connected to socket
    io.on('connection',function(socket){
    //console.log('one user connected: '+socket.id);
      socket.on('username',function(user_name){
      //console.log('userid: '+socket.id);
      console.log('one user connected: '+socket.id);
      users.push({id:socket.id,user_name:user_name});
      len=users.length;
      len--;

      //Send the user_id and list of users
      io.emit('user entrance',users,users[len].id);
      //io.emit('user entrance',user_name);
      console.log(user_name+' connected');
    });

  //Sending geolocation coordinates to a specific user
  socket.on('send:coords',function(data_server){
    socket.broadcast.to(data_server.id).emit('load:coords',
    {long:data_server.long,lat:data_server.lat,id:data_server.id,name:data_server.name});
  });

  socket.on('disconnect',function(){
      for(var i=0;i<users.length;i++){
        if(users[i].id==socket.id){
          users.splice(i,1); //Removing single user
        }
      }
      io.emit('exit',users); //sending list of users
    });

        socket.on('updateDriverLocation',function(data_server){
                    //Send the user_id and list of users
        io.emit('getDriverLoctions',{long:data_server.long,lat:data_server.lat,id:data_server.id,name:data_server.name});
          });
        socket.on('updateDrivingDirection',function(data_server){
                //Send the user_id and list of users
        io.emit('getDrivingDirection',{direction:data_server.direction,id:data_server.id});
          });
});

app.post('/addcartype',index.addcartype);//Adding car type in admin database
app.get('/listcartype',index.listcartype);//List car type
app.post('/driverreg/step_1/:user_id',index.driverreg_step1);//Destiny driver Registrstion step1
app.post('/driverreg/step_2/:user_id',index.driverreg_step2);//Destiny driver Registrstion step2
app.post('/driverreg/step_3/:user_id',index.driverreg_step3);//Destiny driver Registrstion step3
app.get('/driverlist',index.driverlist);//Listing the drivers
app.get('/pickup_list',index.getpickuplist);//Get all pickup history
app.post('/drivermodeon/:user_id',index.drivermodeon);//Enabling the drivermode
app.post('/drivermodeoff/:user_id',index.drivermodeoff);//Disabling the drivermode
app.get('/detail_driver/:user_id',index.singledriverdetails);//Detail of single driver
app.post('/admin_users',index.addadminusers);//Adding admin panel users

//Admin login check
app.post('/adminlogincheck',function(req,res){

  var username=req.body.username;
	var password=req.body.password;
	Adminpanel.findOne({username:username},function(err,user){
		if(err) throw err;
		if(!user){
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		}
		else if(user){
			if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      }
			else{
				var token = jwt.encode(user, 'destinytripapp');
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
			}
		}
	});
});

app.get('/nearest_driver/:lat1/:lon1',index.getnearestdriver);//Get nearest driver
//app.post('/sendrequest/:user_id/:driver_id',index.sendrequest);//Sending request to drivers
app.post('/approve_driver',index.driverapprove);//Approving driver
app.post('/suspend_driver/:driver_id',index.driversuspend);//de-activating driver
app.post('/suspend_user/:_id',index.usersuspend);//de-activating driver
app.post('/approve_user/:_id',index.userapprove);//de-activating driver
//app.get('/innerjoin',index.innerjointest);//Inner join test
app.post('/updatedevicetoken/:id',index.updatetoken);//Updating device token
