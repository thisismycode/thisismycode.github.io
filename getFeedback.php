<?php
// This is to read the feedback and pass it back to the app

// By John Wilson August 2015 213160526 SIT313 Assignment 1
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


if (isset($_SERVER['HTTP_ORIGIN'])) { // Allow access from any origin
	header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}
require_once('Connections/mysql.php'); // connect to the database server

$sql = "SELECT * FROM `userFeedback` ORDER BY `dateTime` DESC";

$result = $conn->query($sql);

//create an output array
$output = array();

//if the MySQL query returned any results
if (mysqli_num_rows($result) > 0){
    //iterate through the results of the query
	while ($row = mysqli_fetch_row($result)) {

        //store the results in the output
		$output[] = $row;
	}

    //send output to the browser encoded in JSON format
	echo json_encode(array('status' => 'success', 'items' => $output));
} else {

    //if no records were found in the database then output an error message encoded in JSON format
	echo json_encode(array('status' => 'error', 'items' => $output));
}

mysqli_free_result($result);

$conn->close();
?>