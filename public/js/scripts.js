//event listeners for signup and login buttons
$(document).ready(function(){

	//Event Listener for Hero Entry
	$("#entry-form").on("submit", function(e){
		e.preventDefault();
		var entryData = $("#entry-form").serialize();
		//console.log(entryData);
		$.ajax({
				url: '/heros',
				type: 'POST',
				data: entryData
				//async: false
				}).done(function(response){
					window.location.assign('/home');
			//$('.not-logged-in').hide();
				console.log(response);
		});
	});


//function checkAuthorization on reload
	function checkAuth() {
		$.get('/current-user', function (data){
			console.log(data);
			if (data.user){
				$('.not-logged-in').hide();
				$('.logged-in').show();
				}else {
				$('.not-logged-in').show();
				$('.logged-in').hide();
			}
		}
	)};
		checkAuth();

	//posts the data to POST form signup, submit listener

	$("#signup-form").on("submit", function(e){
		e.preventDefault();
		var signupData = $("#signup-form").serialize();
		$.post('/users', signupData, function(response){
			$('.not-logged-in').hide();
			$('.logged-in').show();
				console.log(response);
		});
	});

	//event listener for login form
	$("#login-form").on("submit", function(e){
		//e.preventDefault();
		var loginData = $("#login-form").serialize();
		console.log('login data = ', loginData);
		//sends a request to sessions with the users data
		$.post('/sessions', loginData, {async: true}, function(response){
			//this will hide the log in and sign up buttons after signing up
			$('.not-logged-in').hide();
			$('.logged-in').show();
			console.log('response = ', response);
		});
	//});
	});


	//tests to see if user has logged out 
	$(".logged-in").on("click",function(){
		console.log("works");
		$.post('/logout', function(data){
			$('.not-logged-in').show();
			$('.logged-in').hide();
			console.log(data.msg);
		});
	});

});
