<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User panel</title>
</head>

<body>
    <?php
    // check if we are logged in (based on session)
    include "loginVerify.php";

    echo "<h1>Welcome $userLogin</h1>";

    // load our card sets
    // 
    // connect to database
    $servername = "pma.ct8.pl";
    $username = "m42808_admin";
    $password = 'db_p1a$$Wd@m0nKe';
    $db = "m42808_wordChecker";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $db);

    // get all our cards
    $cardsRows = $conn->query("SELECT * from `cardData` WHERE `ownerLogin` = '$userLogin'")->fetch_all(MYSQLI_ASSOC);

    $setIdArray = [];

    $titlesSQLQuery = "SELECT * from `setTitles` WHERE ";

    // make clickable sets
    // 
    // get all our set id's 
    foreach ($cardsRows as $key => $row) {
        if (!in_array($row['setId'], $setIdArray)) {
            $uniqueSetId = $row['setId'];

            // make sql query
            if (count($setIdArray) == 0) {
                $titlesSQLQuery .= "`setId` = '$uniqueSetId'";
            } else {
                $titlesSQLQuery .= "OR `setId` = '$uniqueSetId'";
            }

            array_push($setIdArray, $uniqueSetId);
        }
    }


    // get titles
    $titlesArray = $conn->query($titlesSQLQuery)->fetch_all(MYSQLI_ASSOC);

    // add each to html
    foreach ($titlesArray as $key => $titleRow) {
        $setTitle = $titleRow['setTitle'];
        $setId = $titleRow['setId'];
        echo "<a href='./viewSet.php?setId=$setId'>$setTitle</a>";
    }


    ?>
</body>

</html>