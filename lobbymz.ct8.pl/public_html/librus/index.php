<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>librusMZ</title>
    <style>
        #stickyButton {
            position: sticky !important;
            right: 0 !important;
            top: 10px !important;
            border-radius: 20px 0px !important;
            background-color: #c442db !important;
            color: white !important;

            padding: 15px !important;
            margin: 10px !important;
            z-index: 999 !important;
            font-size: 30px;
        }

        #stickyButton:hover {
            background-color: #7911f7 !important;
        }
    </style>
</head>
<a href="./pdfOrientation.html" id='stickyButton'>Generate PDF</a>

<body>
    <?php
    if (isset($_COOKIE['creds']) || isset($_POST['password'])) {
        include 'librusScrap.php';
        
        $modRes = $dom->saveHTML();

        $modRes = urldecode($modRes);

        // uncoment this to see the results
        echo $modRes;
    } else {
        header("Location: ./login.php");
    }

    ?>

</body>

</html>