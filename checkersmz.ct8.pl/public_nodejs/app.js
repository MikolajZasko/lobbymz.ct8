// zmienne
const express = require("express")
const app = express()
const http = require('http');
const PORT = 3000;
const path = require("path");

const server = http.createServer(app); // tu zmiana

// użycie JSON
app.use(express.json())

// gdzie pliki statyczne
app.use(express.static("dist"))

// lista graczy
let players = []

const { Server } = require("socket.io");
const socketio = new Server(server);

// obsługa socketio
socketio.on('connection', (client) => {
    console.log("client connected with id = ", client.id)
    // client.id - unikalna nazwa klienta generowana przez socket.io

    client.emit("onconnect", {
        clientId: client.id
    })

    client.on("pionkiUpdate", (data) => {
        client.broadcast.emit("pionkiUpdate", data);
    })

    client.on("turnEnd", (data) => {
        client.broadcast.emit("turnEnd", data);
    })
});

// obsługa rządań
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/dist/index.html");
});

app.post("/addUser", function (req, res) {
    let nickName = req.body.nickName

    // check if the same nickname is trying to join
    for (let i = 0; i < players.length; i++) {
        const element = players[i];
        if (element == nickName) {
            res.send({
                message: `sorry <b>${nickName}</b> but someone already used this nickname :(`,
                display: "flex"
            })
        }

    }

    // max players reached
    if (players.length >= 2) {
        res.send({
            message: `sorry <b>${nickName}</b> but 2 players is max :(`,
            display: "flex"
        })
    }
    else {
        res.header("content-type", "application/json")
        if (players.length == 0) {
            res.send({
                message: `hello <b>${nickName}</b> you play white`,
                display: "none",
                nickName: nickName,
                color: "white"
            })
        }
        else {
            res.send({
                message: `hello <b>${nickName}</b> you play black`,
                display: "none",
                nickName: nickName,
                color: "black"
            })

        }
        players.push(nickName)
    }

})
// this sets time for all players / games
const roundTimer = 30

let turnTimer = roundTimer

app.post("/resetUsers", function (req, res) {
    players = []

    turnTimer = roundTimer

    res.header("content-type", "application/json")

    res.send({ message: "players deleted" })
})

app.post("/userCount", function (req, res) {
    res.header("content-type", "application/json")

    res.send({ playersLength: players.length })
})

app.post("/turnTimer", function (req, res) {
    turnTimer -= 1

    res.header("content-type", "application/json")

    res.send({ secs: turnTimer })
})

app.get("/resetTimer", function (req, res) {
    console.log("starting new timer");

    turnTimer = roundTimer

    res.send("ok")
})

app.post("/roundTimer", function (req, res) {
    res.header("content-type", "application/json")

    res.send({ roundTimer: roundTimer })
})

server.listen(3000, () => {
    console.log('server listening on 3000');
});

// start
// app.listen(PORT, function () {
//     console.log("start serwera na porcie " + PORT)
// })