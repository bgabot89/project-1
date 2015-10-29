$(document).ready(function(){
console.log("qualities.js is linked!");
});


//event listener for submit button on qualities ejs page
function Submitter(){
//set event listener
$('#new-list-form').on('click',function(e){
//prevents default action from happening
e.preventDefault();
//post serialized form into server 
$.post('/api/qualities',$(this).serialize(), function(err,response){
	if (err) {
		console.log("there was an error posting");	
	}
	else {
		//append list to the ejs
var newQuality = response;
var listString = makeString(newQuality);
   $("#list-ul").prepend(listString);
      // reset the form 
      $("#new-list-form")[0].reset();
	}
});
});
}

function makeString (list){
	return '<li class="list-group-item"><h4 class="list-group-item-heading">' + qualities.name +
  '</h4><button data-id='+ qualities.id + ' type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
  '</li>';
}


