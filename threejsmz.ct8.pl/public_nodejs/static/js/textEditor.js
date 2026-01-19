let fontSize

document.addEventListener("DOMContentLoaded", function () {

    // find textarea
    let textarea = document.getElementById("textarea")

    // read and update font size
    let fontSize = updateFont("0")

    // refresh at start
    refreshTextEditor()
    updateColor("0")

    textarea.onkeydown = function () {

        // refresh on input
        refreshTextEditor()
    }

    textarea.onkeyup = function () {

        // refresh on input
        refreshTextEditor()
    }

})

function refreshTextEditor() {
    // find textarea
    let texarea = document.getElementById("textarea")

    // count the amount of \n
    let enterNumber = texarea.value.split("\n").length

    // change the row amount for texarea
    texarea.rows = enterNumber + 1

    // find line counter in dom
    let lineCounter = document.getElementById("lineCounter")

    // clear numbers inside
    lineCounter.innerHTML = ""

    // for each \n enter another number
    for (let i = 1; i < enterNumber + 1; i++) {
        lineCounter.innerHTML += `${i}<br>`
    }
}

function updateFont(direction) {
    // direction = +/-

    let data = {
        direction: direction
    }

    data = JSON.stringify(data)

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    };

    fetch("/font", options)
        .then(response => response.json()) // konwersja na obiekt json, jeśli konieczne
        .then(data => {
            let fontSize = data.fontSize

            // find textarea
            let textarea = document.getElementById("textarea")

            // change font
            textarea.style.fontSize = `${fontSize}px`

            // find lineCounter
            let lineCounter = document.getElementById("lineCounter")

            // change font
            lineCounter.style.fontSize = `${fontSize}px`

        }) // sformatowane z wcięciami dane odpowiedzi z serwera
        .catch(error => console.log(error));

}

function updateColor(symbol) {
    data = JSON.stringify({ symbol: symbol })

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    };

    fetch("/color", options)
        .then(response => response.json()) // konwersja na obiekt json, jeśli konieczne
        .then(data => {
            console.log(data);

            let textColor = data.textColor
            let backgroundColor = data.backgroundColor

            // find texts
            let lineCounter = document.getElementById("lineCounter")
            let textarea = document.getElementById("textarea")

            // change the colors
            lineCounter.style.color = textColor
            lineCounter.style.backgroundColor = backgroundColor

            textarea.style.color = textColor
            textarea.style.backgroundColor = backgroundColor

        }) // sformatowane z wcięciami dane odpowiedzi z serwera
        .catch(error => console.log(error));
}

// left buttons 

function fontDown() {
    console.log("fontDown")

    updateFont("-")
}

function color() {
    console.log("color")

    updateColor("+")
}

function fontUp() {
    console.log("fontUp")

    updateFont("+")
}

// buttons under textarea

// saves file on server
function sendAndSave() {

    // find fileRoot
    let fileRoot = document.getElementById("header").innerHTML

    // find text
    let textarea = document.getElementById("textarea")

    let data = JSON.stringify({
        text: textarea.value,
        fileRoot: fileRoot
    })

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    };

    // this will redirect us to filemanager2/path/where/file/was/edited
    fetch("/saveFile", options)
        .then(response => response.json()) // konwersja na obiekt json, jeśli konieczne
        .then(data => {
            console.log(data);
        }) // sformatowane z wcięciami dane odpowiedzi z serwera
        .catch(error => console.log(error));

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