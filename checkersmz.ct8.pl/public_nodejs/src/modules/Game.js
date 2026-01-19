import {
    Raycaster,
    Vector2
} from 'three';
import { Settings } from './Settings';
import Pionek from './Pionek';
import { io } from "https://cdn.socket.io/4.6.0/socket.io.esm.min.js";
import { Tween, Easing } from '@tweenjs/tween.js';

const client = io("wss://checkersmz.ct8.pl")

let game = {
    currentPlayer: "white",
    init(camera, scene, pionki, roundTimer, renderer) {
        game.roundTimer = roundTimer

        // prepare for reciving data
        client.on("pionkiUpdate", (data) => {
            console.log("pionkiUpdate");

            // reset timer
            fetch("/resetTimer")

            // change current player for yourself
            this.currentPlayer = data.currentPlayer

            // check if any pionek moved
            if (this.pionki != data.pionki) {
                console.log("sth has changed!");
            }

            // update pionki
            this.pionki = data.pionki

            console.log("this.pionki", this.pionki);

            // generate pionki from scratch
            this.pionkiGen(this.pionki, scene)

            game.waitingInfoHide()

            let waiting = document.getElementById("waiting")
            let waitingInfo = document.getElementById("waitingInfo")

            waiting.style.display = "none"
            waitingInfo.style.display = "none"

            clearInterval(game.timerInterval)
        })

        // triggers when time (default 30s) passes with no response from player
        // the player loses chance to move
        client.on("turnEnd", (data) => {
            console.log("turnEnd received");

            // display and start the timer
            this.waitingInfoDisplay(game.roundTimer)

            this.timerInterval = setInterval(this.checkTurnStatus, 1000)

            // update current player
            this.currentPlayer = data.currentPlayer

            if (game.currentPionek) {
                if (game.currentPionek.pionek == "1") {
                    // clear currentPionek
                    if (data.currentPlayer == "white") {
                        game.currentPionek.material = Settings.blackPionekMaterial
                    }
                    else {
                        game.currentPionek.material = Settings.whitePionekMaterial
                    }
                }
            }

            // clear current pionek
            game.currentPionek = ""
            game.pionekSelected = false

        })

        // 
        this.pionki = pionki

        // raycaster
        this.raycaster = new Raycaster(); // obiekt Raycastera symulujący "rzucanie" promieni
        this.mouseVector = new Vector2() // ten wektor czyli pozycja w 

        window.addEventListener("mousedown", (e) => {
            this.mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouseVector, camera.threeCamera);

            this.intersects = this.raycaster.intersectObjects(scene.children);

            if (this.intersects.length > 0) {

                // zerowy w tablicy czyli najbliższy kamery obiekt to ten, którego potrzebujemy:
                let caughtObject = this.intersects[0].object

                // check user color from status
                let clientColorDOM = document.getElementById("clientColor")
                this.clientColor = clientColorDOM.innerHTML

                // here we check if it is "Pionek" name
                if (caughtObject.name == "whitePionek") {
                    console.log("whitePionek");

                    // check if player hit his "Pionek"
                    if (this.clientColor == "white" && this.currentPlayer == "white") {

                        // light up the chosen "Pionek"
                        caughtObject.material = Settings.pionekSelectedMaterial

                        let hitTheSame = false

                        // clear previous select
                        if (this.pionekSelected == true) {
                            this.currentPionek.material = Settings.whitePionekMaterial

                            // if player hit the same pionek, unselect pionek
                            if (this.currentPionek.id == caughtObject.id) {
                                hitTheSame = true
                            }
                        }

                        if (hitTheSame) {
                            // clear current pionek
                            this.currentPionek = ""
                            this.pionekSelected = false
                        }
                        else {
                            this.pionekSelected = true
                            this.currentPionek = caughtObject
                        }
                    }
                }
                else if (caughtObject.name == "blackPionek") {
                    console.log("blackPionek");

                    // check if player hit his "Pionek"
                    if (this.clientColor == "black" && this.currentPlayer == "black") {

                        // light up the chosen "Pionek"
                        caughtObject.material = Settings.pionekSelectedMaterial

                        let hitTheSame = false

                        // clear previous select
                        if (this.pionekSelected == true) {
                            this.currentPionek.material = Settings.blackPionekMaterial

                            // if player hit the same pionek, unselect pionek
                            if (this.currentPionek.id == caughtObject.id) {
                                hitTheSame = true
                            }
                        }

                        if (hitTheSame) {
                            // clear current pionek
                            this.currentPionek = ""
                            this.pionekSelected = false
                        }
                        else {
                            this.pionekSelected = true
                            this.currentPionek = caughtObject
                        }


                    }

                }
                // here we check if we hit "Field" element and if we have selected our "Pionek"
                else if (caughtObject.name == "blackField" && this.pionekSelected == true) {
                    console.log("blackField");

                    const moveTo = caughtObject
                    const moveToX = moveTo.position.x / 10
                    const moveToZ = moveTo.position.z / 10

                    // check if space is not occupied
                    if (this.pionki[moveToZ][moveToX] == 0) {

                        // check if space is max 1 block further

                        const currentPionekX = this.currentPionek.position.x / 10
                        const currentPionekZ = this.currentPionek.position.z / 10

                        // check X
                        if (currentPionekX + 1 == moveToX || currentPionekX - 1 == moveToX) {
                            // check X
                            if (currentPionekZ + 1 == moveToZ || currentPionekZ - 1 == moveToZ) {
                                console.log("we can move");

                                // move "pionek"
                                this.animatedPionek = this.currentPionek
                                this.tween = new Tween(this.animatedPionek.position) // start
                                    .to({ x: moveToX * 10, z: moveToZ * 10 }, 1000) // do jakiej pozycji, w jakim czasie
                                    .repeat(0) // liczba powtórzeń
                                    .easing(Easing.Linear.None) // typ easingu (zmiana w czasie)
                                    .onUpdate((coords) => {
                                        this.animatedPionek.position.x = coords.x
                                        this.animatedPionek.position.z = coords.z
                                    })
                                    .onComplete(() => { console.log("koniec animacji") }) // funkcja po zakończeniu animacji
                                    .start()

                                renderer.updateTween(game.tween)

                                // this.currentPionek.position.set(moveToX * 10, 2, moveToZ * 10)

                                // update "pionki" array
                                if (this.clientColor == "white") {
                                    this.pionki[moveToZ][moveToX] = 1

                                    // bring back normal material
                                    this.currentPionek.material = Settings.whitePionekMaterial

                                    // change current player for yourself
                                    this.currentPlayer = "black"
                                }
                                else {
                                    this.pionki[moveToZ][moveToX] = 2

                                    // bring back normal material
                                    this.currentPionek.material = Settings.blackPionekMaterial

                                    // change current player for yourself
                                    this.currentPlayer = "white"
                                }

                                this.pionki[currentPionekZ][currentPionekX] = 0

                                // clear current pionek
                                this.currentPionek = ""
                                this.pionekSelected = false

                                // reset timer
                                fetch("/resetTimer")

                                // update board for all players
                                this.emitPionki()

                                // display wait screen
                                // console.log("game.roundTimer", game);
                                game.waitingInfoDisplay(game.roundTimer)
                                game.timerInterval = setInterval(game.checkTurnStatus, 1000)

                                console.log(this.pionki);
                            }
                            else {
                                console.log("Z coordinate too far");
                            }
                        }
                        else {
                            console.log("X coordinate too far");
                        }
                    }
                    else {
                        console.log("we can't move");
                    }

                }

            }
        });

    },
    emitPionki() {

        console.log("emitPionki");
        console.log(this.pionki);

        let currentPlayer

        // change current player for oponent
        if (this.clientColor == "white") {
            currentPlayer = "black"
        }
        else {
            currentPlayer = "white"
        }

        client.emit("pionkiUpdate", {
            "pionki": this.pionki,
            "currentPlayer": currentPlayer
        })
    },
    pionkiGen(newPionki, scene) {

        console.log("pionkiGen");

        // hide waitingInfo for you
        game.waitingInfoHide()

        // remove all previous pionki
        let allPionki = scene.getObjectsByProperty("pionek", "1")

        // console.log("allPionki", allPionki);

        allPionki.forEach(element => {
            scene.remove(element)
        });

        let x = 0
        let z = 0

        for (let i = 0; i < newPionki.length; i++) {
            const row = newPionki[i];

            for (let j = 0; j < row.length; j++) {
                const cell = row[j];

                if (cell == 2) {
                    // gen black
                    new Pionek("black", scene, x, z)
                }
                else if (cell == 1) {
                    // gen white
                    new Pionek("white", scene, x, z)
                }
                x += 10
            }
            z += 10
            x = 0

        }
    },
    waitingInfoDisplay(secs) {
        // display status
        let waitingInfo = document.getElementById("waitingInfo")
        let waiting = document.getElementById("waiting")

        waiting.style.display = "block"
        waitingInfo.style.display = "block"

        waitingInfo.innerHTML = "oponent's turn: " + secs + " s"
    },
    waitingInfoHide() {
        let waiting = document.getElementById("waiting")
        let waitingInfo = document.getElementById("waitingInfo")

        waiting.style.display = "none"
        waitingInfo.style.display = "none"
    },
    checkTurnStatus() {
        let messageToServer = JSON.stringify({ message: "send me enemy timer" })

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: messageToServer
        };

        // 
        fetch("/turnTimer", options)
            .then(response => response.json())
            .then(data => {
                let secs = parseInt(data.secs)

                if (secs == 0) {
                    // new turn begins

                    // reset timer
                    fetch("/resetTimer")

                    // update board for all players
                    // game.emitPionki()

                    // hide waitingInfo for you
                    game.waitingInfoHide()

                    // emit end turn
                    game.emitTurnEnd()

                    // clear interval
                    clearInterval(game.timerInterval)

                }
                else {
                    game.waitingInfoDisplay(secs)
                }
            }
            )
            .catch(error => console.log(error));

    },
    emitTurnEnd() {
        console.log(this.currentPlayer);

        let currentPlayer

        if (this.currentPlayer == "white") {
            currentPlayer = "black"
            this.currentPlayer = "black"
        }
        else {
            this.currentPlayer = "white"
            currentPlayer = "white"
        }

        client.emit("turnEnd", {
            "message": "the turn has ended",
            "currentPlayer": currentPlayer
        })
    }
}

export default game