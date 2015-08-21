<?php
/*
This is to process the user feedback form
It will sanitise the user input date before commiting it to the database

By John Wilson Aug 2015
*/

if (isset($_SERVER['HTTP_ORIGIN'])) { // Allow access from any origin
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}
require_once('Connections/mysql.php'); // connect to the database server
// $conn holds the database connection


/* feedback table looks like this
CREATE TABLE IF NOT EXISTS `userFeedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) DEFAULT NULL,
  `feedback` varchar(600) NOT NULL,
  `email` varchar(80) DEFAULT NULL,
  `rating` varchar(10) NOT NULL COMMENT 'The user rating',
  `phone` varchar(16) DEFAULT NULL,
  `postcode` varchar(10) DEFAULT NULL,
  `ipAddress` varchar(30) NOT NULL,
  `dateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `viewed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

*/

$theErrorList = array(); // create an array to hold the errors
$theError = ''; // holds the errors
$errorLocation = ''; // holds the id of the input box that has an error so we can change its colour
/* The POST array looks like this

 [_POST] => Array
        (
            [rating] => vpoor
            [userFeedback] => some feedback
            [userName] => John wilson
            [userEmail] => john@aol.com
            [userPhone] => 12345678
            [userPostcode] => 3215
        )        */
$name = str_replace(",", "", $_POST['userName']); // read the data from the post array and replace commas with nothing
$email = str_replace(",", "", $_POST['userEmail']); 
$feedback = str_replace(",","&Dagger;",$_POST['userFeedback']); // replaces any comma's (,) with an HTML character we can replace with commas later
//echo $feedback;
$rating = $_POST['rating'];
$postcode = str_replace(",", "", $_POST['userPostcode']);
$phone = str_replace(",", "", $_POST['userPhone']);
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
if (strlen($email) > 0){ // the email is not compulsory so we only check it if it's length is greater than zero
	if (!filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
	} else {
	    $theError="$email is not a valid email address";
	    $errorLocation= "userEmail";
	    array_push($theErrorList,$theError, $errorLocation);
	}
}
if (strlen($phone) > 1 && strlen($phone) < 8){	// then the phone number has an entry but is invalid
	$theError="$phone is too short for a valid phone number";
	$errorLocation = "userPhone";
	array_push($theErrorList,$theError, $errorLocation);
}
if (strlen($postcode) < 4 && strlen($postcode) > 1){ // then the postcode is too short, but has an entry
	$theError="$postcode is too short for a valid postcode";
	$errorLocation = "userPostcode";
	array_push($theErrorList,$theError, $errorLocation);
}
if ($theError == ''){ // there is no error so we can proceed
	//echo $temp . "<br />";
	//echo $feedback;
	// we'll need to commit the data to the database
	$sql = "INSERT INTO userFeedback (name, feedback, email, rating, phone, postcode, ipAddress) VALUES ('" . $name . "', '" . $feedback . "','" . $email . "','" . $rating . "','" . $phone . "','" . $postcode . "', '" . $ip . "')";
	if ($conn->query($sql) === TRUE) {
    	echo "Hot to trot";
	} else {
    	echo "<br />Error: " . $sql . "<br />" . $conn->error;
	}
	$conn->close(); // close the database connection
	//return true;

} else {
	// there was an error so we need to send some info back regarding the error
	for ($x=0; $x<sizeof($theErrorList); $x++){
		echo $theErrorList[$x];
		echo ","; // a separator to aid processing in the javascript
	}
	//return false;
}

?>
