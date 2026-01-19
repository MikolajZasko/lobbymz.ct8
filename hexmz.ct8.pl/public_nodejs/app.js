// zmienne
const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path");

// użycie parsera
app.use(express.urlencoded({ extended: true }))

// użycie JSON
app.use(express.json())

let savedGame = JSON.stringify({ test: "test" })

// obsługa rządań
app.post("/saveOnServer", function (req, res) {
    savedGame = req.body

    console.log(savedGame);

    res.send("ok")
})

app.post("/loadFromServer", function (req, res) {
    res.send(savedGame)

})

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
})

app.get("/game", function (req, res) {
    res.sendFile(path.join(__dirname, "dist", "game.html"))
})

app.get("/hex", function (req, res) {
    res.sendFile(path.join(__dirname, "dist", "hex.html"))
})

// gdzie pliki statyczne
app.use(express.static("dist"))

// start
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})