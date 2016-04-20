$(document).ready(function(){


//function checkAuthorization on reload
	function checkAuth() {
		$.get('/current-user', function (data){
			console.log(data);
			if (data.user){
				$('.not-logged-in').hide();
				$('.logged-in').show();
				$('.test-button').show();
				console.log('logged in!');
				}else {
				$('.not-logged-in').show();
				$('.logged-in').hide();
				console.log('error logging in');
			}
		}
	)}

	checkAuth();

	//event listener for login form
	$("#login-form").on("submit", function(e){
		e.preventDefault();
		var loginData = $("#login-form").serialize();
		console.log('login data = ', loginData);
		//sends a request to sessions with the users data
		// $.post('/sessions', loginData, {async: true}, function(response){

			$.post('/sessions', loginData, function(response){
			//this will hide the log in and sign up buttons after signing up, as well the Take a test button
			$('.not-logged-in').hide();
			$('.logged-in').show();
			$('.test-button').show();
			window.location.href=('/home');
		});
	});

	});
