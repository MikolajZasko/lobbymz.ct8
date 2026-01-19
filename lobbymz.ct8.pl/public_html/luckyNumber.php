<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lucky Number</title>
</head>

<body>
    <?php

    // mail part
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    use PHPMailer\PHPMailer\SMTP;

    require './PHPMailer-master/src/Exception.php';
    require './PHPMailer-master/src/PHPMailer.php';
    require './PHPMailer-master/src/SMTP.php';

    // login part
    $login = "8435328u";
    $passwd = "Miki890290";

    function get($url)
    {
        global $ch;
        curl_setopt($ch, CURLOPT_URL, $url); // "The URL to fetch."
        // $info = curl_getinfo($ch);
        // print_r($info);
        $res = curl_exec($ch);
        return $res;
    }

    function post($fields, $url)
    {
        global $ch;
        $POSTFIELDS = http_build_query($fields);
        curl_setopt($ch, CURLOPT_POST, 1); // "true to do a regular HTTP POST."
        curl_setopt($ch, CURLOPT_POSTFIELDS, $POSTFIELDS); // "The full data to post in a HTTP "POST" operation."
        curl_setopt($ch, CURLOPT_URL, $url);
        $res = curl_exec($ch);
        return $res;
    }

    $cookie_file_path = "cookie.txt"; // path do przechowywania ciasteczek 

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie_file_path); // "The name of the file containing the cookie data ..."
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // "Set CURLOPT_RETURNTRANSFER to TRUE to return the transfer as a string of the return value of curl_exec()"
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); // "true to follow any "Location: " header that the server sends as part of the HTTP header."

    // login process
    get("https://synergia.librus.pl/loguj/portalRodzina?v=1706690085");

    $res = post(array(
        "action" => "login",
        "login" => $login,
        "pass" => $passwd
    ), "https://api.librus.pl/OAuth/Authorization?client_id=46");
    $res = json_decode($res);
    $goTo = "https://api.librus.pl" . $res->{'goTo'};

    post(array(
        "command" => "open_synergia_window",
        "commandPayload" => array(
            "url" => "https:\/\/synergia.librus.pl\/uczen\/index"
        )
    ), $goTo);

    // here we save response
    $res = get("https://synergia.librus.pl/przegladaj_oceny/uczen");

    // replace all src and href's
    $toReplace = 'src="';
    $replaceWith = 'src="https://synergia.librus.pl';

    $res = str_replace($toReplace, $replaceWith, $res);

    $toReplace = 'href="';
    $replaceWith = 'href="https://synergia.librus.pl';

    $res = str_replace($toReplace, $replaceWith, $res);

    // php find table
    // 
    // oceny zwykłe

    // Create a new DOMDocument object
    $dom = new DOMDocument();

    // Load your HTML content into the DOMDocument
    @$dom->loadHTML($res);

    // Create a new DOMXPath object
    $xpath = new DOMXPath($dom);

    // Use XPath query to find elements by class
    $classname = "luckyNumber"; // Your desired class name
    $elements = $xpath->query("//*[contains(concat(' ', normalize-space(@class), ' '), ' $classname ')]");

    // Check if any elements were found
    if ($elements->length > 0) {
        // Assuming you want to get the text content of the first matching element
        $span = $elements->item(0);
        $luckyNumber = strval(trim($span->textContent));

        //Create an instance; passing `true` enables exceptions
        $mail = new PHPMailer(true);

        try {
            //Server settings
            // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
            $mail->isSMTP();                                            //Send using SMTP
            $mail->Host       = 's1.ct8.pl';                     //Set the SMTP server to send through
            $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
            $mail->Username   = 'joe@biden.ct8.pl';                     //SMTP username
            $mail->Password   = 'JoeLovesPHP123!@#';                               //SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
            $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

            //Recipients
            $mail->setFrom('joe@biden.gov', 'Joe Biden');
            $mail->addAddress('mikolaj.zasko890290@gmail.com', 'MZ');     //Add a recipient
            // $mail->addAddress('ellen@example.com');               //Name is optional
            // $mail->addReplyTo('info@example.com', 'Information');
            // $mail->addCC('cc@example.com');
            // $mail->addBCC('bcc@example.com');

            //Attachments
            // $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
            // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

            //Content
            $mail->isHTML(true);                                  //Set email format to HTML
            $mail->Subject = "Good Morning America: " . date("Y.m.d");
            $mail->Body    = "Today's luckyNumber is: <b>$luckyNumber</b>";
            $mail->AltBody = "Today's luckyNumber is: $luckyNumber'";

            $mail->send();
            echo 'Message has been sent';
        } catch (Exception $e) {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }
    } else {
        echo "Element with class '$classname' not found.";
    }

    ?>
</body>

</html>