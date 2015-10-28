
// readies document
$(document).ready(function(){
	//declares a function called class type
	function classType(){
		console.log("js is linked");
	  var personalityTypes = $("div.personality-types").find("div.name");
	  console.log(personalityTypes.length);
	  //below will change the text of all the text into the rpg classes
	for (var i = 0; i < personalityTypes.length; i++){   
		var temp = personalityTypes[i].innerText;
		console.log(temp);
		if( temp == "Lonewolf"){
			personalityTypes[i].innerText = "Thief";
		} else if (temp == "Innovator") {
				personalityTypes[i].innerText = "Blacksmith";
		} else if (temp == "Detective") {
				personalityTypes[i].innerText = "Paladin";
		} else if (temp == "Noble") {
				personalityTypes[i].innerText = "Knight";
		} else if (temp == "Team Player") {
				personalityTypes[i].innerText = "Priest";
		} else if (temp == "Intellectual") {
				personalityTypes[i].innerText = "Mage";
		}
		else if (temp == "Berserker") {
				personalityTypes[i].innerText = "Warrior";
		}  
	}
}

/*selects one description
var textTemp = $("div.description").text();
*/

//selects entire description and replaces it with something else
function descriptionType(){
	
$(".description").text(function () {
	console.log(".description");
    return $(this).text().replace("Noble", "Knight"); 
});
}
descriptionType();





// classType();
setTimeout(classType, 500);
setTimeout(descriptionType, 500);
});

