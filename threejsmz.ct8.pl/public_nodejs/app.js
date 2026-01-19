// zmienne
const { log } = require("console");
const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path");
const { message } = require("statuses");
const formidable = require('formidable')


// czytanie plików
const fs = require("fs")

// użycie JSON
app.use(express.json())

// obsługa rządań
app.get("/", function (req, res) {
    console.log(path.join(__dirname, "static", "index.html"));
    res.sendFile(path.join(__dirname, "static", "index.html"))
})

app.get("/fileCheck", function (req, res) {

    let allFiles = []

    const dirNames = fs.readdirSync(path.join(__dirname, "static", "cwiczenia"))

    // katalogi
    console.log("katalogi: ", dirNames)

    for (let i = 0; i < dirNames.length; i++) {
        const files = fs.readdirSync(path.join(__dirname, "static", "cwiczenia", dirNames[i]))

        allFiles.push([dirNames[i], files])


    }


    function trySend() {
        console.log("a");
        if (allFiles.length > 0) {
            console.log(allFiles);
            res.send(allFiles)
            clearInterval(interval)
        }
    }

    let interval = setInterval(trySend, 10)

})


// wysyłanie plików
app.use(express.static('static'))
app.use(express.static('static/cwiczenia'))
app.use(express.static('static/libs'))
app.use(express.static('static/skrypty'))
app.use(express.static('static/mats'))

// start
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})