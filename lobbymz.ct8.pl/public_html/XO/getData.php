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

// get query
$query = $conn->query("SELECT * from game");

// get data
$gameData = $query->fetch_all();

// return data
echo json_encode($gameData);
