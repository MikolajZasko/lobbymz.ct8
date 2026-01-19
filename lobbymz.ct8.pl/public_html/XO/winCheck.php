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

// win conditions
// 123  147 357
// 456  258 159
// 789  369

// for example c1 is cell 1 in html

$c1Value = $gameData[0][1];
$c2Value = $gameData[1][1];
$c3Value = $gameData[2][1];
$c4Value = $gameData[3][1];
$c5Value = $gameData[4][1];
$c6Value = $gameData[5][1];
$c7Value = $gameData[6][1];
$c8Value = $gameData[7][1];
$c9Value = $gameData[8][1];

if ($c1Value == $c2Value && $c1Value == $c3Value && $c1Value != "0") {
    echo json_encode(["message" => "We have a winner!", "winner" => $c1Value]);
} else if ($c4Value == $c5Value && $c4Value == $c6Value && $c4Value != "0") {
    echo json_encode(["message" => "We have a winner!", "winner" => $c4Value]);
} else if ($c7Value == $c8Value && $c7Value == $c9Value && $c7Value != "0") {
    echo json_encode(["message" => "We have a winner!", "winner" => $c7Value]);
} else if ($c1Value == $c4Value && $c1Value == $c7Value && $c1Value != "0") {
    echo json_encode(["message" => "We have a winner!", "winner" => $c1Value]);
} else if ($c2Value == $c5Value && $c2Value == $c8Value && $c2Value != "0") {
    echo json_encode(["message" => "We have a winner!", "winner" => $c2Value]);
} else if ($c3Value == $c6Value && $c3Value == $c9Value && $c3Value != "0") {
    echo json_encode(["message" => "We have a winner!", "winner" => $c3Value]);
} else if ($c3Value == $c5Value && $c3Value == $c7Value && $c3Value != "0") {
    echo json_encode(["message" => "We have a winner!", "winner" => $c3Value]);
} else if ($c1Value == $c5Value && $c1Value == $c9Value && $c1Value != "0") {
    echo json_encode(["message" => "We have a winner!", "winner" => $c5Value]);
} 
  else if ($c1Value != 0 && $c2Value != 0 && $c3Value != 0 && $c4Value != 0 && $c5Value != 0 && $c6Value != 0 && $c7Value != 0 && $c8Value != 0 && $c9Value != 0) {
    echo json_encode(["message" => "We have a tie!", "winner" => ""]);
}
  else {
    echo json_encode(["message" => "noWinner"]);
}
