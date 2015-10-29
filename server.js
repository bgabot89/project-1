//loads the express library to the app
var express = require("express"),
    app = express(),
    ejs = require("ejs"),
 		bodyParser = require('body-parser'),
 		session = require('express-session');

//mongoose ejs
		mongoose = require('mongoose');

//requires the User Model for use in server.js file
var User = require('./models/user');

//middleware to allow use of ejs
app.set("view engine", "ejs");

//allows use of public folder to use css files
app.use("/static", express.static("./public"));
//allows use of bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//allows use of sessions
app.use(session({
	saveUninitialized:true,
	resave: true,
	secret:'secretpass',
	cookie: { secure:true }
}));


//mongod connect to another terminal
mongoose.connect( process.env.MONGOLAB_URI ||
                      process.env.MONGOHQ_URL || 
                      'mongodb://localhost/login_signup');



//route to index file
app.get('/', function (req,res){
	res.render('index');
});

//route to get to the home ejs file from the taskbar
app.get('/home', function (req,res){
	res.render('home');
});



//routes from image on home page to rpg persona
app.get('/rpg', function (req,res){
	res.render('index');
});

//routes to about page 
app.get('/about', function (req,res){
	res.render('about');
});

//routes from login page to window showing online credentials
app.get('/signup', function (req,res){
	res.render('signup');
});

//routes to shown users
app.get('/profilepage', function (req,res){
	res.render('showuser');
});


//new user route -- creates a new user with password
app.post('/users', function (req,res){
//console.log(req.body);
	User.createSecure(req.body.email, req.body.password, function (err,user){
		req.session.userId = user._id;
		res.json(user);


});
});



//when the user inputs data from the sign up form, it'll be added to the json
app.get('/users', function (req,res){
	User.find({}, function(err,Users){
	res.json(Users);
});
});



//routes from login page to window showing online credentials
app.get('/login', function (req,res){
	res.render('login');
});





//route that authenticates the user and creates a new session
app.post('/sessions', function (req,res){
	User.authenticate(req.body.email, req.body.password, function (err, loggedInUser){
		if (err){
      console.log('authentication error: ', err);
      res.status(500).send("error, can't find user");
	} else {
		console.log('setting session id', loggedInUser);
		req.session.userId = loggedInUser._id;
		res.redirect('/home');
		}
	});
});


//route that sends user to logout
app.get('/logout', function (req,res){
	//removes session id
	req.session.userId = null;

	res.redirect('/home');
});

/*
//shows the user profile page
app.get('/profile', function (req,res){
	console.log('session user id: ', req.session.userId);
	User.findOne({_id: req.session.userId}), function (err,currentUser){
		if (err){
			console.log('error found');
			res.redirect('/login');
		} else {
			//render user profile page
			console.log('loading profile page');
			res.render('showUser');
		}
};
});
*/


//JSON GET REQUEST FROM TRAITIFY 

//connects server to heroku
app.listen(process.env.PORT  || 3000, function (){
  console.log("listening on port 3000");
});