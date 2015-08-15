<?php
require_once('Connections/mysql.php');
/*
This is to process the user feedback form
It will sanitise the user input date before commiting it to the database

By John Wilson Aug 2015
*/
//require_once("dv.php");

//$json = $GLOBALS['HTTP_RAW_POST_DATA']; // get the JSON string that has been passed from the webapp

$theErrorList = array(); // create an array to hold the errors
$theError = ''; // holds the errors
$errorLocation = ''; // holds the id of the input box that has an error so we can change its colour
//$theArray = json_decode($json);
//$name = $theArray[0]; // gets the user name
//$email = $theArray[1]; // gets the user email
//$feedback = $theArray[2]; //gets the user feedback
//$rating = $theArray[3]; // gets the rating
//$postcode = $theArray[4]; // gets the postcode
//$phone = $theArray[5]; // gets the phone number

/* The POST array looks like this

 [_POST] => Array
        (
            [rating] => vpoor
            [userFeedback] => some feedback
            [userName] => John wilson
            [userEmail] => john@aol.com
            [userPhone] => 12345678
            [userPostcode] => 3215
        )

        */
$name = $_POST['userName'];
$email = $_POST['userEmail'];
$feedback = $_POST['userFeedback'];
$rating = $_POST['rating'];
$postcode = $_POST['userPostcode'];
$phone = $_POST['userPhone'];

$ip = getenv('HTTP_CLIENT_IP')?:
	getenv('HTTP_X_FORWARDED_FOR')?:
	getenv('HTTP_X_FORWARDED')?:
	getenv('HTTP_FORWARDED_FOR')?:
	getenv('HTTP_FORWARDED')?:
	getenv('REMOTE_ADDR'); 
$date = new DateTime(); // gets the current system date/time

$dateTime = $date->format('Y-m-d H:i:s'); // converts date/time to yyyy-mm-dd hh:mm:ss

// we need to sanitise the user input data
$email = trim(filter_var($email, FILTER_SANITIZE_EMAIL)); // remove illegal characters from the email
$name = trim(filter_var($name, FILTER_SANITIZE_STRING)); // trim the name string and remove any markup
$feedback = trim(filter_var($feedback, FILTER_SANITIZE_STRING)); // trim the feedback and remove any markup and illegal characters
$rating = trim(filter_var($rating, FILTER_SANITIZE_STRING)); // trim the user rating and remove any markup/special characters
$postcode = trim(filter_var($postcode, FILTER_SANITIZE_STRING)); // trim the postcode and remove any markup/special characters
$phone = trim(filter_var($phone, FILTER_SANITIZE_STRING)); // trim the phone number and remove any markup/special characters

// Validate e-mail
if (!filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    //$error+="$email is a valid email address";
} else {
    $theError="$email is not a valid email address";
    $errorLocation= "userEmail";
    array_push($theErrorList,$theError, $errorLocation);
}
if (strlen($phone) > 1 && strlen($phone) < 8){
	
	// then the phone number has an entry but is invalid
	$theError="$phone is too short for a valid phone number";
	$errorLocation = "userPhone";
	array_push($theErrorList,$theError, $errorLocation);


}
if (strlen($postcode) < 4 && strlen($postcode) > 1){
	// then the postcode is too short, but has an entry
	$theError="$postcode is too short for a valid postcode";
	$errorLocation = "userPostcode";
	array_push($theErrorList,$theError, $errorLocation);


}
if ($theError == ''){ // there is no error so we can proceed
	echo "Hot to trot";
	return true;
	//return "Hot to trot";

} else {
	// there was an error so we need to send some info back regarding the error
	for ($x=0; $x<sizeof($theErrorList); $x++){
		echo $theErrorList[$x];
		echo ","; // a separator to aid processing in the javascript
	}
	return false;
}
//require_once('dv.php');
// This needs to validate the form input
// And then put the details into the database before returning a success to the app


?>
