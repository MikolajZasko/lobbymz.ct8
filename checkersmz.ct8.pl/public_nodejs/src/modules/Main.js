import { Scene, BoxGeometry, Mesh, AxesHelper } from 'three';
import Renderer from './Renderer';
import Camera from './Camera';
// import { Settings } from './Settings'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Field from './Field';
import game from './Game';

const container = document.getElementById('root')
const scene = new Scene()
const renderer = new Renderer(scene, container)
const camera = new Camera(renderer.threeRenderer)

const szachownica = [
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
]

let pionki = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],

]

let roundTimer

const options = {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
};


fetch("/roundTimer", options)
    .then(response => response.json())
    .then(data => {
        roundTimer = data.roundTimer

        // wait for server response, then init game 
        game.init(camera, scene, pionki, roundTimer, renderer)
    })

// const controls = new OrbitControls(camera.threeCamera, renderer.threeRenderer.domElement);

const GameObject = {

    axes() {
        // const axesHelper = new AxesHelper(500);
        // scene.add(axesHelper);
    },
    szachownica() {
        let x = 0
        let z = 0

        for (let i = 0; i < szachownica.length; i++) {
            const row = szachownica[i];

            for (let j = 0; j < row.length; j++) {
                const cell = row[j];

                new Field(cell, scene, x, z)

                x += 10
            }

            z += 10
            x = 0
        }
    },
    render() {

        renderer.render(scene, camera);

        // controls.update();

        requestAnimationFrame(GameObject.render);

        camera.threeCamera.lookAt(35, 0, 35)

    },
    setPlayer(data) {
        // ukrycie elementu logowania
        let loggingDiv = document.getElementById("loggingDiv")
        let background = document.getElementById("background")

        loggingDiv.style.display = "none"
        background.style.display = "none"

        // pokazanie ekranu czekania
        let waiting = document.getElementById("waiting")
        let waitingInfo = document.getElementById("waitingInfo")

        waiting.style.display = "block"
        waitingInfo.style.display = "block"

        // display status'u
        let statusInfo = document.getElementById("statusInfo")
        statusInfo.innerHTML = "waiting for 2nd player"

        // czekaj na drugiego gracza
        this.interval = setInterval(this.checkAmountOfPlayers, 1000, data)
        // this.checkAmountOfPlayers(data)

    },
    checkAmountOfPlayers(serverResponse) {
        let messageToServer = JSON.stringify({ message: "send me the number of players" })

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: messageToServer
        };

        // sprawdzenie czy jest 2 graczy?
        fetch("/userCount", options)
            .then(response => response.json())
            .then(data => {
                let playerAmount = parseInt(data.playersLength)

                if (playerAmount == 0) {
                    console.log("you were kicked, the site will be reloaded shortly");

                    let waitingInfo = document.getElementById("waitingInfo")
                    waitingInfo.innerHTML = "you were kicked, the site will be reloaded shortly"

                    clearInterval(GameObject.interval)
                    setTimeout(() => {
                        location.reload()
                    }, 3000);
                }
                else if (playerAmount == 1) {
                    console.log("still alone... we wait!");
                }
                else if (playerAmount == 2) {
                    console.log("the game can start");

                    clearInterval(GameObject.interval)

                    // z poprzedniego requesta zmieniamy pokazywany mesage
                    statusInfo.innerHTML = serverResponse.message

                    // display pionków
                    game.pionkiGen(pionki, scene)

                    // zmiana pozycji kamery
                    camera.playerCamera(serverResponse.color)

                    let waitingInfo = document.getElementById("waitingInfo")
                    let waiting = document.getElementById("waiting")

                    // if black display waiting status + timer

                    if (serverResponse.color == "black") {
                        game.waitingInfoDisplay(roundTimer)

                        game.checkTurnStatus()
                        game.timerInterval = setInterval(game.checkTurnStatus, 1000)
                    }
                    else {
                        // hide if white / it is your turn
                        waiting.style.display = "none"
                        waitingInfo.style.display = "none"
                    }

                }
            }
            )
            .catch(error => console.log(error));
    }


}
export { GameObject }
