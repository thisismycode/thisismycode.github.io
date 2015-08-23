/* myJS.js

by John Wilson 213160526 for SIT313 assignment 1 August 2015

*/
var ratingClicked = ''; // holds which feedback rating has been clicked
var outputString = ''; // this is to hold additional output we may push to the page depending on user input

var isThisAMobileDevice = false;

function isMobile() { // this function is based on the one from here http://magentohostsolution.com/3-ways-detect-mobile-device-jquery/
	try{ 
  	document.createEvent("TouchEvent"); // attempt to create a touch event
  	isThisAMobileDevice = true;
  	$('#phone1').attr("href", "tel:0400000111"); // set the phone number 1 link
  	$('#phone2').attr("href", "tel:0355551111"); // set the phone number 2 link
  	return true;
  }
  catch(e){ 
  	
  	isThisAMobileDevice = false; // then there was no touch interface so probably no phone service
  	$('#phone1').attr("href", ""); // clear the phone number 1 link
  	$('#phone2').attr("href", ""); // clear the phone number 2 link

  	return false; 
  }
}

function js_yyyy_mm_dd_hh_mm_ss () { // this function is based of the one here http://tylerfrankenstein.com/user/4/code/javascript-date-time-yyyy-mm-dd-hh-mm-ss
	now = new Date();
	year = "" + now.getFullYear();
	month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
	day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
	hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
	minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
	second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
	return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

function feedbackRating(theRating){
	console.log("The rating = " + theRating);
	// let's show the additional info box
	$('#feedbackText').fadeIn();
	switch(theRating){
		case "poor":
		ratingClicked = "poor";
		askQuestion("poor");
		break;
		case "vpoor":
		ratingClicked = "vpoor";
		askQuestion("vpoor");
		break;
		case "average":
		ratingClicked = "average";
		askQuestion("average");			
		break;
		case "good":
		ratingClicked = "good";
		askQuestion("good");
		break;
		case "vgood":
		ratingClicked = "vgood";
		askQuestion("vgood");
		break;
		default:
		ratingClicked = '';
	}
}
function askQuestion(theRating){
	// this is to change the dialog depending on the user feedback
	var theQuestion = '<br />';
	if (theRating == 'vpoor'){
		theQuestion = "<larger>Really" + "&#8253;</larger>" + " Please tell us what we did so badly?";
	}
	if (theRating == 'poor'){
		theQuestion = "Oh, OK, I guess we have room for improvement, can you please elaborate?";
	}
	if (theRating == 'average'){
		theQuestion = "Right, we're getting better now, what can we do to improve your next visit?";
	}
	if (theRating == 'good'){
		theQuestion = "Nice, we're glad to please. Any comments on how to make your next visit even better?";
	}
	if (theRating =="vgood"){
		theQuestion = "Super, that pleases us greatly. Any suggestions for improvement would be appreciated.";
	}
	$('#ratingDiv').hide();
	$('#feedbackLabel').html(theQuestion);
	$('#additionalDetails').fadeIn();

}

function processTheFeedback(){
	// this is to process the feedback form before sending it to the backend
	// as we're using JQM jQuery is there by default so let's make use of it

	/* the feedback form contains the following fields (id's)
	userName  ---- holds the entered name
	email ----  holds the email address
	userFeedback ---- holds any feedback they may have entered
	rating = vpoor,poor,average,good,vgood





	*/
	var userName = $('#userName').val();

	var userEmail = $('#userEmail').val();
	//$('#textOutput').append("<br />" + userEmail);

	var userFeedback = $('#userFeedback').val();
	var userPostcode = $('#userPostcode').val();
	var userPhone = $('#userPhone').val();
	//$('#textOutput').append("<br />" + userFeedback);

	//$('#textOutput').append("<br />Rating: " + ratingClicked);

	// we want to build an array of the sanitised input which we can the JSON.stringify to send to the backend
	var theDate = js_yyyy_mm_dd_hh_mm_ss(); // returns the date formatted as MSB -> LSB which makes sorting easier
	var theUserIP = ""; // this will be added by the backend when the data is sent
	var resultsArray = []; // holds the contents of the form
	resultsArray.push(userName); // push the username into the array
	resultsArray.push(userEmail); // push the email into the array
	resultsArray.push(userFeedback); // push the userFeedback into the array
	resultsArray.push(ratingClicked); // push the user rating into the array
	resultsArray.push(userPostcode); // push the postcode into the array
	resultsArray.push(userPhone); // push the phone number into the array
	resultsArray.push(theUserIP); // push the IP into the array (it doesn't really exist here, it'll be added at the backend)
	resultsArray.push(theDate); // push the submitted date/time into the array

	var theString = JSON.stringify(resultsArray); // convert the array to a JSON string
	//console.log(theString);
	// we'll use ajax to send the data to the backend

// Assign handlers immediately after making the request,
// and remember the jqxhr object for this request
//var jqxhr = $.post( "theFormInput.php", $('#theFeedbackForm').serialize(), function(data) { // for local hosting only
	var jqxhr = $.post( "https://emeraldnetworksolutions.com.au/sit313/theFormInput.php", $('#theFeedbackForm').serialize(), function(data) {

  // this indicates that ajax was able to talk to the PHP and return some data
  // we need to check the data to see if it contains an error condition
  if ( data == 'Hot to trot'){ // then we have success
  	feedbackSuccess(userName);

  } else {
  	// there is some sort of error
  	feedbackFailure(data);
  }

})
	.done(function() {
  //  alert( "second success" );
})
	.fail(function(errMsg) {
		alert( "error -" + JSON.stringify(errMsg));
	})
	.always(function() {
    //alert( "finished" );
});

}

function feedbackSuccess(theUserName){ // do stuff here when the feedback was successfully submitted
	var feedBackMessage = '<p>Thanks for the feedback ' + theUserName + '!</p>';
	feedBackMessage += "<p>Your feedback helps us to know what we are doing right as well as what's not.</p>";
	$('#ratingDiv').hide();
	$('#phone1').hide();
	$('#phone2').hide();
	$('#theFeedbackForm').hide();
	$('#feedbackThanks').html(feedBackMessage);
	$('#feedbackThanks').fadeIn();
}
function feedbackFailure(theErrorList){
	$('#userEmail').css("background-color","white");
	$('#userPhone').css("background-color","white"); // clear any red boxes from previous attempts
	$('#userPostcode').css("background-color", "white");
	// we're here because there was an error in the input data
// errorList is like this "['john.aol.com is not a valid email address'],['userEmail']"
var theErrorArray = theErrorList.split(',');
console.log(theErrorArray.length);
	// the error array should always contain either nothing or an error message(s) and error location(s)
	if (theErrorArray.length > 0){ // then there are some errors
		$('#textOutput').html(''); // clear the text output
		for (var y=0;y<theErrorArray.length-2;y=y+2){ //step by 2's in the loop
			console.log("Error: " + theErrorArray[y]);
		console.log("Location: " + theErrorArray[y+1])
		$('#' + theErrorArray[y+1]).css("background-color","red");
		$('#textOutput').append(theErrorArray[y] + "<br />");
	}
}
}

function showAccidentDetails(){
	// if someone clicks on the text about the accident we want to show them some more details, maybe even an image or too

	// but for now let's just pop up an alert

	alert("Wow, you're keen. But if we tell you how it actually happened you might repeat it and get hurt. Safety first children.");
}