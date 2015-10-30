$(document).ready(function(){
console.log("qualities.js is linked!");
Submitter();
SubmitForm();
});


//event listener for submit button on qualities ejs page
function Submitter(){
//set event listener
$('#new-list-form').on('submit',function(e){
//prevents default action from happening
e.preventDefault();
//post serialized form into server 
$.post('/api/qualities',$(this).serialize(), function(data){
		//append list to the ejs
		console.log(data);
var newQuality = data;
var listString = makeString(newQuality);
   $("#list-ul").prepend(listString);
   console.log(listString, 'listString');
      // reset the form 
      //$("#new-list-form")[0].reset();
    });
});
}

function makeString (qualities){
	return '<li class="list-group-item"><h4 class="list-group-item-heading">' + qualities.name +
  '</li>';
}

function SubmitForm(){

//set event listener
$('#submitForm').on('click',function(e){
//prevents default action from happening
console.log("it clicked!");
e.preventDefault();
alert("Thanks for submitting your form! We'll reach out to you once your avatar is ready!");

});
}

