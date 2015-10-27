//loads the express library to the app
var express = require("express"),
    app = express(),
    ejs = require("ejs"),
 		bodyParser = require('body-parser'),

//mongoose ejs
		mongoose = require('mongoose');

//uses the User Model and pulls it from the database
var User = require('./models/user');

//middleware to allow use of ejs
app.set("view engine", "ejs");

//allows use of public folder to use css files
app.use("/static", express.static("./public"));
//allows use of bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//mongod connect to another terminal
mongoose.connect('mongodb://localhost/login_signup');




//route to index file
app.get('/', function (req,res){
	res.render('index');
});

//route to get to the home ejs file from the taskbar
app.get('/home', function (req,res){
	res.render('home');
});

//routes from login page to window showing online credentials
app.get('/login', function (req,res){
	res.render('login');
});


//routes from login page to window showing online credentials
app.get('/signup', function (req,res){
	res.render('signup');
});

//routes from image on home page to rpg persona
app.get('/rpg', function (req,res){
	res.render('index');
});

//routes to about page 
app.get('/about', function (req,res){
	res.render('about');
});

//when the user inputs data from the sign up form, it'll be added to the json
app.get('/users', function (req,res){
	User.find({}, function (err,Users){
	res.json(Users);
});
});
//route to show all users that have signed up
app.post('/users', function (req,res){
console.log(req.body);

});

//JSON GET REQUEST FROM TRAITIFY 

//connects server to heroku
app.listen(process.env.PORT || 3000);
/*app.listen(3000, function (){
  console.log("listening on port 3000");
});*/