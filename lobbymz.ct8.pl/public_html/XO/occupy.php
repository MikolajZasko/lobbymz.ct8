<?php

include "checkSession.php";

$symbol = $_SESSION['symbol'];

// get current player
// 
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

// get current player
$currentPlayer = $conn->query("SELECT * from currentplayer")->fetch_assoc()['currentplayer'];

// check if it is your turn
if ($currentPlayer == $symbol) {
    // check if not occupied

    // get query
    $query = $conn->query("SELECT * from game");

    // get data
    $gameData = $query->fetch_all();

    $cellID = $_REQUEST['cellID'];

    $cellIDNumber = $cellID[1] - 1;

    // $c1Value = $gameData[0][1];
    // $c2Value = $gameData[1][1];
    // $c3Value = $gameData[2][1];
    // $c4Value = $gameData[3][1];
    // $c5Value = $gameData[4][1];
    // $c6Value = $gameData[5][1];
    // $c7Value = $gameData[6][1];
    // $c8Value = $gameData[7][1];
    // $c9Value = $gameData[8][1];

    if ($gameData[$cellIDNumber][1] == "0") {
        // perform occupy action
        $conn->query("UPDATE `game` SET `value` = '$symbol' WHERE `cell_id` = '$cellID'");

        if ($symbol == "X") {
            $enemySymbol = "O";
        } else {
            $enemySymbol = "X";
        }

        // change currentPlayer
        $conn->query("UPDATE `currentplayer` SET `currentplayer` = '$enemySymbol'");

        // return success
        echo json_encode(["message" => "Opponents turn", "status" => "success"]);
    } else {
        // return proper message
        echo json_encode(["message" => "You cant do that", "currentPlayer" => $currentPlayer, "symbol" => $_SESSION['symbol']]);
    }
} else {
    // return proper message
    echo json_encode(["message" => "You cant do that", "currentPlayer" => $currentPlayer, "symbol" => $_SESSION['symbol']]);
}
