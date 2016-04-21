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
var Hero = require('./models/hero');
var Quality = require('./models/quality');

//middleware to allow use of ejs
app.set("view engine", "ejs");

//allows use of public folder to use css files
app.use("/static", express.static("./public"));
//allows use of bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//allows use of sessions + cookies
app.use(session({
	saveUninitialized:true,
	resave: false,
	secret:'secretpass',
	cookie: { maxAge: 600000 } // 10 minutes per session
}));

//mongod connect to another terminal
mongoose.connect( process.env.MONGOLAB_URI ||
                      process.env.MONGOHQ_URL ||
                      'mongodb://localhost/login_signup');

//Data api for list of qualities

var qualities = [
{id:0, name: "Insert quality here"}
];

//route to index file
app.get('/', function (req,res){
	var email = req.session.email;
	res.render('home',{email: email});
});

//route to get all data from the array list and sends it to the json
app.get("/api/qualities", function (req,res){
	//sends data as json
	res.json(qualities);
});

//api route to create a new entry to the api list
app.post("/api/qualities", function (req,res){
var newQuality = req.body;
//adds a unique id;
if (qualities.length !== 0){
	newQuality.id = qualities[qualities.length-1].id+1;
}
	else {
		newQuality.id=0;
	}
	//pushes unique id into json
	qualities.push(newQuality);
	res.json(qualities);
});


//route to get to the home ejs file from the taskbar
app.get('/home', function (req,res){
	var email = req.session.email;
	var hero = req.session.hero;
	// console.log(req.session, 'HOME req.session');
	res.render('home', {hero: hero, email:email});
});



//routes from image on home page to rpg persona
app.get('/rpg', function (req,res){
	var email = req.session.email;
	res.render('index',{email: email});
});

//routes to tests
app.get('/tests', function (req,res){
  res.render('TestSelection');
});

//routes to D&D page
app.get('/dungeons', function (req,res){
  res.render('dungeons');
});

//routes to League page
app.get('/league', function (req,res){
  res.render('league');
});

//routes to League page
app.get('/leaguetest', function (req,res){
  res.render('LeagueTest');
});


//routes to Fire Emblem page
app.get('/fire', function (req,res){
  res.render('fire');
});

//routes to Fire Emblem Test page
app.get('/firetest', function (req,res){
  res.render('FireTest');
});

//routes to Dark Souls page
app.get('/dark', function (req,res){
  res.render('darksouls');
});

//routes to Pokemon page
app.get('/pokemon', function (req,res){
  res.render('pokemon');
});

//routes to Pokemon  Test page
app.get('/pokemontest', function (req,res){
  res.render('PokemonTest');
});

//routes to D&D Personality test
app.get('/test', function (req,res){
  res.render('test');
});

//routes to Dragon Age page
app.get('/dragonage', function (req,res){
  res.render('dragonage');
});


//routes to about page
app.get('/about', function (req,res){
	var email = req.session.email;
	res.render('about',{email: email});
});

//routes from login page to window showing online credentials
app.get('/signup', function (req,res){
	var email = req.session.email;
	res.render('signup',{email: email});
});

//routes from login page to window showing online credentials
app.get('/contact', function (req,res){
	var email = req.session.email;
	res.render('contact',{email: email});
});


//routes to qualities app
app.get('/qualities', function (req,res){
	var email = req.session.email;
	res.render('qualities', {qualities: qualities, email:email});
});

//routes to shown users
app.get('/profilepage', function (req,res){
	res.render('showuser');
});

//route shown to hero page
app.get('/hero', function (req,res){
	var email = req.session.email;
	res.render('hero',{email: email});
});


//new user route -- creates a new user with password
app.post('/users', function (req,res){
	var user = req.body;
	console.log(user);
	User.createSecure(user.email, user.password, function (err,user){
		if (user.save) {
		req.session.userId = user._id;
		req.session.user = user;
		res.json({user: user, msg: "User Created Successfully"});
	} else {
		console.log('There was an error when creating a new user');
	}
});
});

//check to see if user is logged in
app.get('/current-user', function (req,res){
	res.json({user: req.session.user});
});


//when the user inputs data from the sign up form, it'll be added to the json
app.get('/users', function (req,res){
	User.find({}, function(err,Users){
	res.json(Users);
});
});

//new user route -- creates a new user with password
app.post('/heros', function (req,res){
//console.log(req.body);
//console.log(Hero);
	Hero.createSecure(req.body.input, function (err,hero){
		req.session.hero = req.body.input;
		//console.log(req.body.input);
		res.redirect('/home');


});
});

//when the user inputs data from the hero form, it'll be added to a json
app.get('/heros', function (req,res){
	Hero.find({}, function(err,Heros){
	res.json(Heros);
});
});


//routes from login page to window showing online credentials
app.get('/login', function (req,res){
	// console.log(req.session.userId);
	var email = req.session.email;
	res.render('login', {email: email});
});





//OLD ROUTE - FOR LOGIN SESSION - route that authenticates the user and creates a new session
app.post('/sessions', function (req,res){
	User.authenticate(req.body.email, req.body.password, function (err, loggedInUser){
		if (err){
      // console.log('authentication error: ', err);
      res.status(500).send("error, can't find user");
	} else {
		// console.log('setting session id', loggedInUser);
		// console.log(req.session, 'before');
		req.session.userId = loggedInUser._id;
		req.session.email = loggedInUser.email;

		req.session.save(function(err){
			// console.log(req.session, 'after');
			console.log('Logged in. req.session.userId = ', req.session.userId);
			res.redirect('/home');

		});

		}
	});
});


//new route for login path - jQuery hide and show works for this
app.post('/login', function (req,res){
	User.authenticate(req.body.email, req.body.password, function (err, user){
		if (err) {
			console.log("there was an err: ", err)
		} else {
			req.session.user = user;
			res.json = user;
			res.redirect('/home');
		}
	})
})

//route that sends user to logout
app.post('/logout', function (req,res){
	//removes session id
	req.session.userId = null;
	req.session.user = null;
	req.session.email = null;
	console.log('Logged out. req.session.userId = ', req.session.userId);
	console.log('req.session.email = ', req.session.email);
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
