<?php
include "checkSession.php";

// connect to database
$servername = "pma.ct8.pl";
$username = "m42808_admin";
$password = 'db_p1a$$Wd@m0nKe';
$db = "m42808_OX";

// Create connection
$conn = new mysqli($servername, $username, $password, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
// echo "Connected successfully";

// create new db
// $conn->query("CREATE DATABASE IF NOT EXISTS ox");

// select new db
// $conn->query("USE ox");

// insert data from sql file
$filename = "ox.sql";

// Temporary variable, used to store current query
$templine = '';
// Read in entire file
$lines = file($filename);
// Loop through each line
foreach ($lines as $line) {
    // Skip it if it's a comment
    if (substr($line, 0, 2) == '--' || $line == '')
        continue;

    // Add this line to the current segment
    $templine .= $line;
    // If it has a semicolon at the end, it's the end of the query
    if (substr(trim($line), -1, 1) == ';') {
        // Perform the query
        $conn->query($templine) or print('Error performing query \'<strong>' . $templine . '\': '  . '<br /><br />');
        // Reset temp variable to empty
        $templine = '';
    }
}

// update status
$conn->query("UPDATE `status` SET `status`='0' WHERE 1");

$_SESSION = array();
