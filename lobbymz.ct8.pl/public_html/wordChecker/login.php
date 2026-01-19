<?php
if (isset($_POST['password']) && isset($_POST['login'])) {
    // continie the program

    // get user pass and login
    $userPass = $_POST['password'];
    $userLogin = $_POST['login'];

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
    if (password_verify($userPass, $hashedPass)) {
        // setup session
        session_start();

        $_SESSION['login'] = $userLogin;
        $_SESSION['password'] = $userPass;

        header("Location: ./panel.php");
    } else {
        header("Location: ./login.html");
    }
} else {
    header("Location: ./login.html");
}
