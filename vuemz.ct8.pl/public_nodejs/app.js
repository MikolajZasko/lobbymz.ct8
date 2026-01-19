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

const products = [
    { name: "Mouse", checked: false },
    { name: "LapTok", checked: false },
    { name: "CoNputer", checked: false },
    { name: "Monitor", checked: false },
    { name: "Headphones", checked: false },
    { name: "TEST", checked: false }
]

const deliveries = [
    { name: 'Kurier', imgSrc: "/gfx/Kurier.jpeg" },
    { name: 'Post', imgSrc: "/gfx/poczta.jpg" },
    { name: 'Herself', imgSrc: "/gfx/Osobiście.png" }
]

const payments = [
    { name: "card", imgSrc: "/gfx/payments.jpg" },
    { name: "upon receipt", imgSrc: "/gfx/cashOnDelivery.jpg" },
    { name: "Polish Post", imgSrc: "/gfx/pocztaPL.jpg" }
]

// forms zad 6
app.get("/fetchServerData", function (req, res) {
    res.send(JSON.stringify({ products: products, payments: payments, deliveries: deliveries }))
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