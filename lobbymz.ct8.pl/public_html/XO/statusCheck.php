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

// skip checking / we already have a symbol
// if (isset($_SESSION['symbol'])) {
//   echo json_encode(["message" => "nothing"]);
// } else {
// Check status
$status = $conn->query("SELECT * from status")->fetch_assoc()['status'];

if ($status == "0") {
  // still nothing
  echo json_encode(["message" => "nothing", "status" => $status]);
} else {
  // somebody occupied other
  if ($status == "O") {
    $_SESSION['symbol'] = "X";
    echo json_encode(["message" => "X"]);
  } else if ($status == "X") {
    $_SESSION['symbol'] = "O";
    echo json_encode(["message" => "O"]);
  }
}
// }
