//event listeners for signup and login buttons
$(document).ready(function(){
console.log("The js file is linked to this page");
var $SignupForm = $("signup-form");
$SignupForm.on("submit", function(e){
	e.PreventDefault();
	var user = $("#signup-form").serialize();
  $.post('/users', user, function(data){
    console.log(data);
  });
});
});
