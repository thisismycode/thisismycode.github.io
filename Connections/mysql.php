// This is to connect to the remote MySQL Database

<?php
$servername = "184.107.243.203"; // here I put the actual IP address
$username = "emeraldn_sit313";
$password = "fm9ygh1uw399op";
//mysql_connect($serverName,$userName,$passCode);
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";


?>