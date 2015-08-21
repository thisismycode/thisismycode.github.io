<?php
// This is to read the feedback and pass it back to the app

// By John Wilson August 2015
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
if ((isset($_GET['read'])) && ($_GET['read']==1)){
	$viewed = "0"; // geting the unread feedback
} else {
	$viewed = "1"; //getting the read feedback
}
//echo "Hello John";
require_once('Connections/mysql.php'); // connect to the database server

//$viewed = '0'; //0 for unviewed feedback, 1 for previously viewed feedback

$sql = "SELECT * FROM `userFeedback` WHERE viewed=";


$sql = $sql . $viewed . " ORDER BY `dateTime` DESC";


$result = $conn->query($sql);

//create an output array
$output = array();

//if the MySQL query returned any results

//echo "Results length = " . mysqli_num_rows($result);
if (mysqli_num_rows($result) > 0){
    //iterate through the results of your query
    while ($row = mysqli_fetch_row($result)) {

        //add the results of your query to the output variable
        $output[] = $row;
    }

    //send your output to the browser encoded in the JSON format
    echo json_encode(array('status' => 'success', 'items' => $output));
} else {

    //if no records were found in the database then output an error message encoded in the JSON format
    echo json_encode(array('status' => 'error', 'items' => $output));
}

mysqli_free_result($result);



$conn->close();
?>