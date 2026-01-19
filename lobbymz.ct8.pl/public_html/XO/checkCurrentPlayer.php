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

$currentPlayer = $conn->query("SELECT * from `currentplayer`")->fetch_assoc()['currentplayer'];

if ($currentPlayer == $_SESSION['symbol']) {
    echo json_encode(["message" => "Your Turn", "currentPlayer" => $currentPlayer, "symbol" => $_SESSION['symbol']]);
} else {
    echo json_encode(["message" => "Opponent's Turn", "currentPlayer" => $currentPlayer, "symbol" => $_SESSION['symbol']]);
}
