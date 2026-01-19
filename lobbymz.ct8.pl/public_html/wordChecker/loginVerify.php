<?php
// get user pass and login
session_start();

$userPass = $_SESSION['password'];
$userLogin = $_SESSION['login'];

// connect to database
$servername = "pma.ct8.pl";
$username = "m42808_admin";
$password = 'db_p1a$$Wd@m0nKe';
$db = "m42808_wordChecker";

// Create connection
$conn = new mysqli($servername, $username, $password, $db);

// get login and hashed pass
$userRow = $conn->query("SELECT * from `loginData` WHERE login = '$userLogin'")->fetch_assoc();

$hashedPass = $userRow['password'];

// verify password
if (!password_verify($userPass, $hashedPass)) {
    header("Location: ./login.html");
}
