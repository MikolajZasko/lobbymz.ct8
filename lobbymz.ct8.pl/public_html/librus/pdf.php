<head>
    <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon" />
    <title>GetPDF</title>
</head>

<body>

</body>
<?php
// check orientation
if (isset($_POST['orientation'])) {
    $orientation = $_POST['orientation'];
    if ($orientation == "P") {
        // portrait
        $przedmiotWidth = "120px";
        $ocenyBiezWidth = "100px";
        $ocenaKoncowaWidth = "25px";
        $okres2Width = "170px";
        $okres1Width = "195px"; //$okres2Width + $ocenaKoncowaWidth;
        $sredniaWidth = "50px";
        $koniecRokuWidth = "100px";
    } else if ($orientation == "L") {
        // landscape
        $przedmiotWidth = "180px";
        $ocenyBiezWidth = "150px";
        $ocenaKoncowaWidth = "30px";
        $okres2Width = "230px";
        $okres1Width = "260px"; //$okres2Width + $ocenaKoncowaWidth;
        $sredniaWidth = "50px";
        $koniecRokuWidth = "100px";
    } else {
        header("Location: ./login.php");
    }
} else {
    header("Location: ./login.php");
}

// echo $sredniaWidth;

// default time zone
date_default_timezone_set("Europe/Warsaw");

// Start the buffering //
ob_start();

echo "<table id=\"table\">
<tr>
    <th style=\"font-size:20px;font-weight:900;border-bottom: 1px solid black; text-align:center; width:$przedmiotWidth;\" rowspan=\"2\">Przedmiot</th>
    <th style=\"font-size:20px;font-weight:900;text-align:center;width:$okres1Width;border-right:1px solid black;\" colspan=\"4\">Okres 1</th>
    <th style=\"font-size:20px;font-weight:900;text-align:center;width:$okres2Width;border-right:1px solid black;\" colspan=\"3\">Okres 2</th>
    <th style=\"font-size:20px;font-weight:900;text-align:center;width:$koniecRokuWidth;\" colspan=\"2\">Koniec Roku</th>
</tr>
<tr>
    <th style=\"font-size:15px;border-bottom: 1px solid black;font-weight:900;width:$ocenyBiezWidth;text-align:center;border-right:1px solid black;border-left:1px solid black;\">Oceny bieżące</th>
    <th style=\"font-size:15px;border-bottom: 1px solid black;font-weight:900;width:$sredniaWidth;text-align:center;border-right:1px solid black;\">Śr. 1</th>
    <th style=\"font-size:15px;border-bottom: 1px solid black;font-weight:900;width:$ocenaKoncowaWidth;text-align:center;border-right:1px solid black;\">(1)</th>
    <th style=\"font-size:15px;border-bottom: 1px solid black;font-weight:900;width:$ocenaKoncowaWidth;text-align:center;border-right:1px solid black;\">1</th>
    <th style=\"font-size:15px;border-bottom: 1px solid black;font-weight:900;width:$ocenyBiezWidth;text-align:center;border-right:1px solid black;\">Oceny bieżące</th>
    <th style=\"font-size:15px;border-bottom: 1px solid black;font-weight:900;width:$sredniaWidth;text-align:center;border-right:1px solid black;\">Śr. 2</th>
    <th style=\"font-size:15px;border-bottom: 1px solid black;font-weight:900;width:$ocenaKoncowaWidth;text-align:center;border-right:1px solid black;\">2</th>
    <th style=\"font-size:15px;border-bottom: 1px solid black;font-weight:900;width:$sredniaWidth;text-align:center;border-right:1px solid black;\">Śr.R</th>
    <th style=\"font-size:15px;border-bottom: 1px solid black;font-weight:900;width:$ocenaKoncowaWidth;text-align:center;\">R</th>
</tr>";
// get data
include 'librusScrap.php';

// find all "przedmioty
// 
// reset "przedmiot" id counter
$przedmiotIdcounter = 0;

// refresh dom xpath
// 
// Create a new DOMDocument object
$dom = new DOMDocument();

// Load your HTML content into the DOMDocument
@$dom->loadHTML($res);

// Create a new DOMXPath object
$xpath = new DOMXPath($dom);

// find all rows
$elements = $xpath->query("//table[@class='decorated stretch'][2]//tbody/tr[@class='line0' and not(@id) or @class='line1' and not(@id)]/td[2]");

foreach ($elements as $element) {
    // get "przedmiot" name
    $nodVal = $element->nodeValue;
    $nodVal = strval($nodVal);

    // save "przedmiot" name
    $tmpTableArray[$przedmiotIdcounter]["name"] = $nodVal;

    // omit 4 last rows
    if (count($elements) == $przedmiotIdcounter + 4) {
        break;
    };

    $przedmiotIdcounter += 1;
}

// fix remaining "sr_1" "sr_2"
for ($i = 0; $i < count($tmpTableArray); $i++) {
    if ($tmpTableArray[$i]["sr_1"] == "") {
        $tmpTableArray[$i]["sr_1"] = "-";
    }
    if ($tmpTableArray[$i]["sr_2"] == "") {
        $tmpTableArray[$i]["sr_2"] = "-";
    }
    if (strlen($tmpTableArray[$i]["sr_R"]) == 2) {
        $tmpTableArray[$i]["sr_R"] = "-";
    }
}

// fix this, super unreliable (can delete rows)
array_pop($tmpTableArray);
array_pop($tmpTableArray);
array_pop($tmpTableArray);

// build the table
foreach ($tmpTableArray as $przedmiot) {
    // print_r($przedmiot["oceny1"]);
    echo "<tr>";
    echo "<td style=\"border-right: 1px dashed black; padding:2px;text-align:center;width:$przedmiotWidth\">" . $przedmiot['name'] . "</td>";
    echo "<td style=\"border-right: 1px dashed black; padding:2px;text-align:center;width:$ocenyBiezWidth\">";
    if (count($przedmiot["oceny1"]) == 0) {
        echo "-";
    } else {
        foreach ($przedmiot['oceny1'] as $ocena) {
            echo $ocena;
        }
    }
    echo "</td>";
    echo "<td style=\"border-right: 1px dashed black; padding:2px;text-align:center;width:$sredniaWidth;\">" . $przedmiot['sr_1'] . "</td>";
    echo "<td style=\"border-right: 1px dashed black; padding:2px;text-align:center;width:$ocenaKoncowaWidth;\">" . $przedmiot['(1)'] . "</td>";
    echo "<td style=\"border-right: 1px dashed black; padding:2px;text-align:center;width:$ocenaKoncowaWidth;\">" . $przedmiot['1'] . "</td>";
    echo "<td style=\"border-right: 1px dashed black; padding:2px;text-align:center;width:$ocenyBiezWidth\">";
    if (count($przedmiot["oceny2"]) == 0) {
        echo "-";
    } else {
        foreach ($przedmiot['oceny2'] as $ocena) {
            echo $ocena;
        }
    }
    echo "</td>";
    echo "<td style=\"border-right: 1px dashed black; padding:2px;text-align:center;width:$sredniaWidth;\">" . $przedmiot['sr_2'] . "</td>";
    echo "<td style=\"border-right: 1px dashed black; padding:2px;text-align:center;width:$ocenaKoncowaWidth;\">" . $przedmiot['2'] . "</td>";
    echo "<td style=\"border-right: 1px dashed black; padding:2px;text-align:center;width:$sredniaWidth;\">" . $przedmiot['sr_R'] . "</td>";
    echo "<td style=\"padding:2px;text-align:center;width:$ocenaKoncowaWidth;\">" . $przedmiot['R'] . "</td>";
    echo "</tr>";
}

echo '</table>';

file_put_contents('pdf.html', ob_get_contents());

// Create a new DOMDocument object
$dom = new DOMDocument();

// TCPDF magic
// 
// include library
include('./TCPDF/tcpdf.php');

// Extend the TCPDF class to create custom Header and Footer
class MYPDF extends TCPDF
{

    //Page header
    public function Header()
    {
        // Set font
        // $this->SetFont('helvetica', 'B', 20);
        // Title
        $this->SetY(0);
        $this->SetX(-50);
        $this->Cell(0, 0, date("Y.m.d-H:i:s"));

        $this->SetY(0);
        $this->SetX(10);
        $this->Cell(0, 0, "Oceny Ucznia");

        // draw a line
        $pageWidth = $this->GetPageWidth();

        $startX = 0;
        $startY = 5;

        $endX = $pageWidth;
        $endY = $startY;

        $this->setLineWidth(1.5);
        // $this->setLineStyle(2.5);

        $this->Line($startX, $startY, $endX, $endY);
    }

    // Page footer
    public function Footer()
    {
        // Position at 15 mm from bottom
        $this->SetY(-15);
        // Set font
        $this->SetFont('helvetica', 'I', 8);
        // Page number
        $this->Cell(0, 10, 'Page ' . $this->getAliasNumPage() . '/' . $this->getAliasNbPages(), 0, false, 'C', 0, '', 0, false, 'T', 'M');
    }
}

$pdf = new MYPDF($orientation, "mm", "A4", true, 'UTF-8');

$pdf->setPrintFooter(false);
$pdf->setPrintHeader(true);

// modify header
// $pdf->SetHeaderData(false, false, "Oceny Ucznia", date("Y.m.d"));
// $pdf->SetHeaderMargin(10);

$pdf->setHeaderFont(array('dejavusans', '', 10, '', false));
$pdf->setFooterFont(array('dejavusans', '', 8, '', false));
$pdf->SetFont('dejavusans', '', 10, '', false);

// set auto page breaks
$pdf->SetAutoPageBreak(TRUE, 10);


$html = file_get_contents("pdf.html");

$pdf->AddPage();

$pdf->writeHTML($html);

$pdf->Output(__DIR__ . '/pdf.pdf', dest: 'F');

// show pdf
header("Location: ./pdf.pdf");

?>
</table>