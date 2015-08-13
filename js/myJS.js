/* myJS.js

by John Wilson for SIT313

*/
var ratingClicked = ''; // holds which feedback rating has been clicked
var outputString = ''; // this is to hold additional output we may push to the page depending on user input

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
	var theQuestion = '';
	if (theRating == 'vpoor'){
		theQuestion = "<strong>Really" + "&#8253;</strong>" + " Please tell us what we did so badly?";
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
	vpoor
	poor
	average
	good
	vgood




	*/
	var userName = $('#userName').val();
	//alert(userName);
	$('#textOutput').html(userName);

	var userEmail = $('#userEmail').val();
	$('#textOutput').append("<br />" + userEmail);

	var userFeedback = $('#userFeedback').val();
	$('#textOutput').append("<br />" + userFeedback);

	$('#textOutput').append("<br />Rating: " + ratingClicked);
}