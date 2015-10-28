//event listeners for signup and login buttons
$(document).ready(function(){

/*
var $SignupForm = $("signup-form");
$SignupForm.on("submit", function(e){
	e.PreventDefault();
	var user = $("#signup-form").serialize();
  $.post('/users', user, function(data){
    console.log(data);
  });
});
*/

//posts the data to POST form signup, submit listener

$("#signup-form").on("submit", function(e){
	e.preventDefault();
	var signupData = $("#signup-form").serialize();
console.log(signupData);
$.post('/users', signupData, function(response){
		console.log(response);
});
});

//event listener for login form
$("#login-form").on("submit", function(e){
	//e.preventDefault();
	var loginData = $("#login-form").serialize();
console.log(loginData);
//sends a request to sessions with the users data
//$.post('/sessions', loginData, {async: true}, function(response){
	console.log(response);
});
//});
});