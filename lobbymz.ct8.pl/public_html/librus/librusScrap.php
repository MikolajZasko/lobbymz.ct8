<?php

if (isset($_POST['password'])) {
    $passwd = $_POST['password'];
    $login = $_POST['login'];

    // cookie for 15 mins
    setcookie("creds", $passwd . "_" . $login, time() + (15 * 60));
} else if (isset($_COOKIE['creds'])) {
    $explodedCookie = explode("_", $_COOKIE['creds']);

    $passwd = $explodedCookie[0];
    $login = $explodedCookie[1];
} else {
    header("Location: ./login.php");
}


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

// remove sort option
$pattern = "/<div class=[\"']?right screen-only[\"']?.*?<\/div>/s";

preg_match_all($pattern, $res, $matches);

$replaceWith = '';

for ($i=0; $i < count($matches[0]); $i++) { 
    $element = $matches[0][$i];

    $res = str_replace($element, $replaceWith, $res);
}


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
$classname = "decorated stretch"; // Your desired class name
$elements = $xpath->query("//table[@class='$classname']");

$tableTag = $elements->item(1);

$tmpTableArray = array();
$przedmiotId = 0;

// marks cell array
$marksCellArray1 = [];
$marksCellArray2 = [];

// array of places for avg's
$arrayAvgPlace1 = [];
$arrayAvgPlace2 = [];
$arrayAvgPlaceR = [];

// each tr tag
foreach ($tableTag->childNodes as $trTag) {

    // check if it is a dom element
    if (get_class($trTag) == "DOMElement") {
        $trClass = $trTag->getAttribute('class');
        $trId = $trTag->getAttribute('id');

        // echo $trClass . " " . $trId . "<br>";

        if (strlen($trId) == 0) {
            $tmpTableArray[$przedmiotId] = array("oceny1" => [], "oceny2" => [], "sr_1" => "", "sr_2" => "", "(1)" => "",  "1" => "", "2" => "", "name" => "", "sr_R" => "", "R" => "");

            // reset / set variables
            $marksCount1 = floatval(0);
            $marksValue1 = floatval(0);

            $marksCount2 = floatval(0);
            $marksValue2 = floatval(0);

            $avgPlace1;
            $avgPlace2;
            $avgPlaceYear;

            $nextAvg = 0;

            $markWeight = 1;

            $cellId = 0;
            // each data cell in tr
            foreach ($trTag->childNodes as $cell) {
                // $cell = $trTag->childNodes->item(0);
                // check if node id dom element
                if ($cell->nodeType == 1) {

                    // get cells for point marks
                    if ($cellId == 2) {
                        if ($cell->textContent == "Brak ocen") {
                            $cell->textContent = "";
                        };
                        $marksCellArray1[$przedmiotId] = $cell;
                    }
                    if ($cellId == 6) {
                        if ($cell->textContent == "Brak ocen") {
                            $cell->textContent = "";
                        };
                        $marksCellArray2[$przedmiotId] = $cell;
                    }

                    // each data tag in cell
                    foreach ($cell->childNodes as $content) {

                        // $content = $cell->childNodes->item(2);
                        // check if node id dom element
                        if ($content->nodeType == 1 && $cellId != 4 && $cellId != 5 && $cellId != 8 && $cellId != 12) {

                            $class = $content->getAttribute('class');
                            $style = strval($content->getAttribute('style'));
                            $style = trim($style);

                            $tagName = $content->tagName;

                            $src = $content->getAttribute("src");

                            // find tittle to get mark weight
                            foreach ($content->childNodes as $spanData) {
                                if ($class == "grade-box" && $spanData->nodeType == 1) {
                                    $title = $spanData->getAttribute('title');
                                    // get int
                                    $pattern = "/>Waga:\s(\d)</mU";
                                    preg_match($pattern, $title, $matches);

                                    @$markWeight = intval($matches[1]);
                                }
                            }

                            // find span's with class ="grade-box"
                            if ($class == "grade-box") {

                                if ($nextAvg == 0) {
                                    // add mark to funn array
                                    array_push($tmpTableArray[$przedmiotId - 1]["oceny1"], $content->textContent . "(" . $markWeight . ")");
                                    // array_push($tmpTableArray[$przedmiotId - 1]["oceny1Waga"], $markWeight);
                                } else if ($nextAvg == 1) {
                                    // add mark to funn array
                                    array_push($tmpTableArray[$przedmiotId - 1]["oceny2"], $content->textContent . "(" . $markWeight . ")");
                                    // array_push($tmpTableArray[$przedmiotId - 1]["oceny2Waga"], $markWeight);
                                } else {
                                  //print_r($tmpTableArray);
                                    // add mark to funn array
                                    //array_push($tmpTableArray[$przedmiotId - 1]["R"], $content->textContent . "(" . $markWeight . ")");
                                    
                                  
                                  // array_push($tmpTableArray[$przedmiotId - 1]["ocenyRWaga"], $markWeight);
                                }


                                $innerHtml = '';
                                $innerHtml = $dom->saveHTML($content);

                                // get marks as numeric values
                                // 

                                $hasPlus = explode("+", $content->textContent);
                                // echo "- Inner HTML: " . $innerHtml;

                                $intMarkValue = $content->textContent;

                                $intMarkValue = intval($intMarkValue);

                                // check if is text, if yes don't add to avg's
                                if ($intMarkValue == 0) {
                                }
                                // check if has +
                                if (count($hasPlus) >= 2) {

                                    // echo "<br>";
                                    // echo "before add: " . $intMarkValue;
                                    // echo "<br>";

                                    $intMarkValue += 0.5;

                                    // echo "<br>";
                                    // echo "after add: " . $intMarkValue;
                                    // echo "<br>";

                                    if ($nextAvg == 0) {
                                        $marksValue1 += $intMarkValue * $markWeight;
                                        $marksCount1 += 1 * $markWeight;
                                        // echo "<br>";
                                        // echo "marksValue1: " . $marksValue1;
                                        // echo "<br>";
                                    } else if ($nextAvg == 1) {
                                        $marksValue2 += $intMarkValue * $markWeight;
                                        $marksCount2 += 1 * $markWeight;
                                    }
                                }
                                // check if isnumber
                                // with no + 
                                else if (is_numeric($intMarkValue)) {
                                    if ($nextAvg == 0) {
                                        $marksValue1 += $intMarkValue * $markWeight;
                                        $marksCount1 += 1 * $markWeight;
                                    } else if ($nextAvg == 1) {
                                        $marksValue2 += $intMarkValue * $markWeight;
                                        $marksCount2 += 1 * $markWeight;
                                    }
                                }
                            } else if ($tagName == "img" && $class == "tooltip helper-icon" && $src == "https://synergia.librus.pl/images/pomoc_ciemna.png") {

                                $cell->setAttribute("style", "text-align:center;");

                                // save place for avg
                                if ($nextAvg == 0) {
                                    $avgPlace1 = $cell;

                                    $arrayAvgPlace1[$przedmiotId - 1] = $cell;
                                }
                                if ($nextAvg == 2) {
                                    $avgPlace2 = $cell;

                                    $arrayAvgPlace2[$przedmiotId - 1] = $cell;
                                }
                                if ($nextAvg == 1) {
                                    $avgPlaceYear = $cell;

                                    $arrayAvgPlaceR[$przedmiotId - 1] = $cell;
                                }
                                $nextAvg += 1;
                            }
                        }
                        // here we get (1)
                        else if ($cellId == 4) {
                            $markString = trim(strval($content->textContent));
                            $tmpTableArray[$przedmiotId - 1]["(1)"] = $markString;
                        }
                        // here we get 1
                        else if ($cellId == 5) {
                            $markString = trim(strval($content->textContent));
                            $tmpTableArray[$przedmiotId - 1]["1"] = $markString;
                        }
                        // here we get 2
                        else if ($cellId == 8) {
                            $markString = trim(strval($content->textContent));
                            $tmpTableArray[$przedmiotId - 1]["2"] = $markString;
                        }
                        // here we get sr_R
                        else if ($cellId == 10) {
                        
                            $markString = trim(strval($content->textContent));
                            $tmpTableArray[$przedmiotId - 1]["sr_R"] = $markString;
                        }
                        // here we get R
                        else if ($cellId == 12) {
                            $markString = trim(strval($content->textContent));
                            $tmpTableArray[$przedmiotId - 1]["R"] = $markString;
                        }
                    }
                    $cellId += 1;
                }
            }
            // count average semester 1
            if (@$marksCount1 > 0) {

                $avg = round(($marksValue1 / $marksCount1), 2);

                // place avg
                $avgPlace1->nodeValue = $avg;

                $tmpTableArray[intval($przedmiotId - 1)]["sr_1"] = strval($avg);
            }

            // count average semester 2
            if (@$marksCount2 > 0) {

                $avg = round(($marksValue2 / $marksCount2), 2);

                // place avg
                $avgPlaceYear->nodeValue = $avg;

                $tmpTableArray[intval($przedmiotId - 1)]["sr_R"] = strval($avg);
            }

            // count average yearly
            if (@$marksCount2  + $marksCount1 > 0) {
                $yearCount = $marksCount2 + $marksCount1;
                $yearValue = $marksValue2 + $marksValue1;

                $avg = round(($yearValue / $yearCount), 2);

                // place avg
                $avgPlace2->nodeValue = $avg;

                $tmpTableArray[intval($przedmiotId - 1)]["sr_2"] = strval($avg);
            }

            // next row
            $przedmiotId = $przedmiotId + 1;
        }
    }
}


// php find table
// 
// oceny punktowe

// Create a new DOMDocument object
// $dom = new DOMDocument();

// Load your HTML content into the DOMDocument
// @$dom->loadHTML($res);

// Create a new DOMXPath object
$xpath = new DOMXPath($dom);

// Use XPath query to find elements by class
$classname = "decorated stretch"; // Your desired class name
$elements = $xpath->query("//table[@class='$classname']");

$tableTag = $elements->item(2);

$tableTags = $tableTag->childNodes;

$tBodyTag = $tableTags->item(2);

// $tmpTableArray = array();
$przedmiotId = 0;

// each tr tag
foreach ($tBodyTag->childNodes as $trTag) {
    // check if it is a dom element
    if (get_class($trTag) == "DOMElement") {

        $trClass = $trTag->getAttribute('class');
        $trId = $trTag->getAttribute('id');

        if (strlen($trId) == 0) {
            // $tmpTableArray[$przedmiotId] = array("oceny1" => [], "oceny2" => [], "sr_1" => "", "sr_2" => "", "(1)" => "",  "1" => "", "2" => "", "name" => "");

            // reset / set variables
            $ourScore1 = floatval(0);
            $base1 = floatval(0);

            $ourScore2 = floatval(0);
            $base2 = floatval(0);

            // $avgPlace1;
            // $avgPlace2;
            // $avgPlaceYear;

            $nextAvg = 0;

            // $markWeight = 1;

            $cellId = 0;
            // each data cell in tr
            foreach ($trTag->childNodes as $cell) {
                // $cell = $trTag->childNodes->item(0);
                // check if node id dom element
                if ($cell->nodeType == 1) {

                    if ($cellId == 1) {
                        // echo $cell->textContent;
                    }

                    // get "przedmiot" names
                    if ($cellId == 2) {
                        // $tmpTableArray[0] = $content->textContent
                        // echo $cell->textContent;
                        // echo "<br>";
                        // echo "new line";
                        // echo "<br>";
                    }

                    // each data tag in cell
                    foreach ($cell->childNodes as $content) {
                        // $content = $cell->childNodes->item(2);
                        // check if node id dom element
                        if ($content->nodeType == 1) {

                            foreach ($content->childNodes as $span) {

                                if ($span->nodeType == 1) {
                                    $class = $span->getAttribute('class');
                                    $style = strval($span->getAttribute('style'));
                                    $style = trim($style);

                                    $tagName = $span->tagName;

                                    // echo "<br>";
                                    // echo $tagName;
                                    // echo "<br>";

                                    // find span's with class ="grade-box"
                                    if ($cellId == 4) {

                                        $nextAvg += 1;
                                        
                                    }
                                    else if ($class == "" && $cellId != 3 && $cellId != 4 && $cellId != 6 && $cellId != 7) {
                                        if ($nextAvg == 0) {
                                            // add mark to funn array
                                            array_push($tmpTableArray[$przedmiotId]["oceny1"], $span->textContent . " ");
                                            // array_push($tmpTableArray[$przedmiotId - 1]["oceny1Waga"], $markWeight);
                                        } else if ($nextAvg == 1) {
                                            // add mark to funn array
                                            array_push($tmpTableArray[$przedmiotId]["oceny2"], $span->textContent . " ");
                                            // array_push($tmpTableArray[$przedmiotId - 1]["oceny2Waga"], $markWeight);
                                        }
                                         else {
                                             // add mark to funn array
                                             array_push($tmpTableArray[$przedmiotId]["ocenyR"], $span->textContent);
                                             // array_push($tmpTableArray[$przedmiotId - 1]["ocenyRWaga"], $markWeight);
                                         }


                                        // $innerHtml = '';
                                        // $innerHtml = $dom->saveHTML($span);

                                        // get marks as numeric values
                                        // 

                                        $markArray = explode("/", $span->textContent);
                                        // echo "- Inner HTML: " . $innerHtml;

                                        // echo "<br>";
                                        // echo "przedmiotId: " . $przedmiotId;
                                        // echo "<br>";
                                        // print_r($markArray);
                                        // echo "<br>";

                                        $ourMarkValue = floatval($markArray[0]);
                                        $baseMarkValue = floatval($markArray[1]);

                                        // echo "<br>";
                                        // echo "after add: " . $intMarkValue;
                                        // echo "<br>";

                                        if ($nextAvg == 0) {
                                            $ourScore1 += $ourMarkValue;
                                            $base1 += $baseMarkValue;
                                            // echo "<br>";
                                            // echo "marksValue1: " . $marksValue1;
                                            // echo "<br>";
                                        } else if ($nextAvg >= 1) {
                                            $ourScore2 += $ourMarkValue;
                                            $base2 += $baseMarkValue;
                                        }

                                        // echo "<br>";
                                        // echo trim($content->textContent);
                                        // echo "<br>";

                                        if ($content->nodeType == 1 && strlen(trim($content->textContent)) != 1) {

                                            // copy node content
                                            // $markAsText = $content->textContent;

                                            // create span node
                                            $spanNode = $content->cloneNode(true);

                                            if ($nextAvg == 0) {
                                                //paste node to upper table
                                                $marksCellArray1[$przedmiotId + 1]->append($spanNode);
                                            } else if ($nextAvg >= 1) {
                                                $marksCellArray2[$przedmiotId  + 1]->append($spanNode);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    $cellId += 1;
                }
            }
            // count average semester 1
            if (@$ourScore1 > 0) {

                $avg = round(($ourScore1 / $base1) * 100, 2);

                $tmpTableArray[intval($przedmiotId)]["sr_1"] = strval($avg) . "%";

                // place avgs in the 1st table
                $arrayAvgPlace1[$przedmiotId]->nodeValue = $avg . "%";
            }

            // count average semester 2
            if (@$ourScore2 > 0) {

                $avg = round(($ourScore2 / $base2) * 100, 2);

                $tmpTableArray[intval($przedmiotId)]["sr_2"] = strval($avg) . "%";

                // place avgs in the 1st table
                $arrayAvgPlaceR[$przedmiotId]->nodeValue = $avg . "%";
            }

            // count average yearly
            if ($ourScore2 + $ourScore1 > 0) {
                $yearScore = $ourScore2 + $ourScore1;
                $yearBase = $base2 + $base1;

                $avg = round(($yearScore / $yearBase) * 100, 2);

                $tmpTableArray[intval($przedmiotId)]["sr_R"] = strval($avg) . "%";

                // place avgs in the 1st table
                $arrayAvgPlace2[$przedmiotId]->nodeValue = $avg . "%";
            }

            // echo "<br>";
            // echo $przedmiotId;
            // echo "<br>";

            // next row
            $przedmiotId = $przedmiotId + 1;
        }
    }
}
  
//   print_r($tmpTableArray);
