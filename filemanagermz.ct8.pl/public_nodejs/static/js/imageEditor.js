let panelWidth = "0px"

// save and clear panel innerHtml
let panelContent
document.addEventListener("DOMContentLoaded", function () {
    let panel = document.getElementById("panel")
    panelContent = panel.innerHTML
    panel.innerHTML = ""
})

// variables for fetch
const headers = { "Content-Type": "application/json" }
let body

function filters() {
    const panel = document.getElementById("panel")

    if (panelWidth == "0px") {
        document.getElementById("panel").style.width = "200px"

        panelWidth = "200px"

        // modify panelContent
        setTimeout(() => {
            panel.innerHTML = panelContent
        }, 100);

    }
    else {
        document.getElementById("panel").style.width = "0px"

        panelWidth = "0px"

        // modify panelContent
        panelContent = panel.innerHTML
        panel.innerHTML = ""

    }
}

function defaultImg() {
    console.log("defaultImg");

    document.getElementById("mainImage").style.filter = ''

    updateCanvas("defaultImg")
}

function grayscale() {
    console.log("grayscale");

    document.getElementById("mainImage").style.filter = 'grayscale(100%)'

    updateCanvas("grayscale")
}

function invert() {
    console.log("invert");

    document.getElementById("mainImage").style.filter = 'invert(100%)'

    updateCanvas("invert")
}

function sepia() {
    console.log("sepia");

    document.getElementById("mainImage").style.filter = 'sepia(100%)'

    updateCanvas("sepia")
}

function updateCanvas(filter) {
    const canvas = document.createElement('canvas')

    const context = canvas.getContext('2d')

    const mainImage = document.getElementById("mainImage")

    let image = new Image()

    console.log(mainImage.style);

    image.src = mainImage.style.backgroundImage.slice(4, -1).replace(/"/g, "")

    image.onload = function () {
        canvas.width = image.width // testowa szerokość, docelowo trzeba zamienić na rzeczywistą szerokość obrazka
        canvas.height = image.height // testowa wysokość, docelowo trzeba zamienić na rzeczywistą wysokość obrazka
        context.filter = `${filter}(100%)`; // przykładowy filtr
        context.drawImage(image, 0, 0, canvas.width, canvas.height); // obrazek z filtrem widocznym na canvasie

        let dataUrl = canvas.toDataURL("image/jpeg")

        // get filepath from header
        let filePath = document.getElementById("header").innerHTML

        // override the body
        body = JSON.stringify({
            dataUrl: dataUrl,
            partialPath: filePath
        }, null)


    }

}

function save() {
    console.log("saving...");
    console.log(body);

    fetch("/saveimage", { method: "post", body, headers })
        .then(response => response.json())
        .then(
            data => {
                let imageStatus = document.getElementById("imageStatus")

                imageStatus.innerHTML = data.message
            }
        )
}

// changeFileName
function changeFileName() {
    // find the dialog
    let dialogRename = document.getElementById("dialogRename")

    // show Dialog
    dialogRename.showModal()

    // find close button
    let cancel = document.getElementsByClassName("cancel")[0]

    cancel.addEventListener("click", function () {
        dialogRename.close()
    })

}