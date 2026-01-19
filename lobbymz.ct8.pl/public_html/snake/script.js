document.addEventListener("DOMContentLoaded", function () {
    console.log("loaded");

    // generate table 
    // size should not be an even number!!!
    // safe lowest value: 3
    let size = 11

    let playArray = []

    let board = document.getElementById("board")

    let snakeDirection, snakeSize, inetrval

    for (let i = 0; i < size + 2; i++) {
        playArray[i] = []

        let tr = document.createElement("tr")

        for (let j = 0; j < size + 2; j++) {
            let td = document.createElement("td")

            if (i == 0 || i == size + 1 || j == 0 || j == size + 1) {
                playArray[i][j] = "x"
                td.innerHTML = "x"
                td.className = "border"

                // make nice playBorad with rounded edges
                if (i == 0 && j == 0) {
                    td.classList.add("leftTop")
                }
                else if (i == size + 1 && j == 0) {
                    td.classList.add("rightDown")
                }
                else if (i == 0 && j == size + 1) {
                    td.classList.add("rightTop")
                }
                else if (i == size + 1 && j == size + 1) {
                    td.classList.add("leftDown")
                }

            }
            else {
                playArray[i][j] = 0
                // td.innerHTML = `${i}:${j}`
            }

            td.id = `${i}:${j}`

            tr.append(td)
        }
        board.append(tr)

    }

    // place the snake in the middle
    let center = Math.round(size / 2)
    let domCenter = document.getElementById(`${center}:${center}`)
    domCenter.className = "headUp"
    // domCenter.className = "turnUR"

    // current head placement 
    playArray[center][center] = 1

    // set the default size
    snakeSize = 1

    // spawn a random vaiable fruit
    function fruitSpawn() {
        let fruitX, fruitY

        do {
            fruitX = Math.floor((Math.random() * size) + 1);
            fruitY = Math.floor((Math.random() * size) + 1);
        }
        while (playArray[fruitX][fruitY] != 0)

        playArray[fruitX][fruitY] = "f"

        let fruitDom = document.getElementById(`${fruitX}:${fruitY}`)
        // fruitDom.style.backgroundColor = "yellow"
        fruitDom.className = "fruit"
    }
    fruitSpawn()

    let first = true

    window.addEventListener("keydown", function (e) {
        let pressedKey = e.code
        console.log(pressedKey);

        if (pressedKey == "ArrowUp" && snakeDirection != "down") {
            snakeDirection = "up"
        }
        else if (pressedKey == "ArrowDown" && snakeDirection != "up") {
            snakeDirection = "down"
        }
        else if (pressedKey == "ArrowLeft" && snakeDirection != "right") {
            snakeDirection = "left"
        }
        else if (pressedKey == "ArrowRight" && snakeDirection != "left") {
            snakeDirection = "right"
        }

        // game start
        if (first) {
            inetrval = setInterval(gameTick, 200)
            gameTick()
            first = false
        }

        // for testing purposes, if arrows clicked snake moves
        // snake doesn't move on its own
        // if (pressedKey == "ArrowRight" || pressedKey == "ArrowLeft" || pressedKey == "ArrowDown" || pressedKey == "ArrowUp") {
        //     gameTick()
        // }
    })

    // game tick
    function gameTick() {

        let snakeHeadX, snakeHeadY, snakeHead
        // move the body
        for (let i = 0; i < size + 2; i++) {
            for (let j = 0; j < size + 2; j++) {
                if (playArray[i][j] == 1) {
                    snakeHead = `${i}:${j}`
                }
                if (playArray[i][j] >= 1) {
                    playArray[i][j] += 1
                }
                if (playArray[i][j] > snakeSize) {
                    playArray[i][j] = 0
                }

            }

        }

        snakeHead = snakeHead.split(":")
        snakeHeadX = parseInt(snakeHead[0])
        snakeHeadY = parseInt(snakeHead[1])

        if (snakeDirection == "up") {
            snakeHeadX -= 1
        }
        else if (snakeDirection == "down") {
            snakeHeadX += 1
        }
        else if (snakeDirection == "left") {
            snakeHeadY -= 1
        }
        else if (snakeDirection == "right") {
            snakeHeadY += 1
        }
        else {
            console.log("snake direction is undefined");
        }

        let snakeHeadDom = document.getElementById(`${snakeHeadX}:${snakeHeadY}`)
        // allows us to display tail when fruit has been hit
        let hitFruit = false

        // check if hit fruit
        if (playArray[snakeHeadX][snakeHeadY] == "f") {
            // clear the background
            let fruitDom = document.getElementById(`${snakeHeadX}:${snakeHeadY}`)
            // fruitDom.style.backgroundColor = "white"
            // fruitDom.className = ""

            console.log("Zjadłeś owocka");

            if (snakeDirection == "up") {
                playArray[snakeHeadX + 1][snakeHeadY] = 2
            }
            else if (snakeDirection == "down") {
                playArray[snakeHeadX - 1][snakeHeadY] = 2
            }
            else if (snakeDirection == "left") {
                playArray[snakeHeadX][snakeHeadY + 1] = 2
            }
            else if (snakeDirection == "right") {
                playArray[snakeHeadX][snakeHeadY - 1] = 2
            }
            snakeSize += 1
            hitFruit = true
            fruitSpawn()
        }

        // check if hit itself
        if (playArray[snakeHeadX][snakeHeadY] > 0) {
            alert("gratulacje!!! zjadłeś swój ogon!!!")
            snakeHeadDom.style.backgroundColor = "red"
            clearInterval(inetrval)

            // last time correctly show all snake parts
            for (let i = 0; i < size + 2; i++) {
                for (let j = 0; j < size + 2; j++) {
                    // check if has snake part on it

                    let playNubmer = parseInt(playArray[i][j])
                    console.log(playNubmer);
                    if (playNubmer > 1 && playNubmer <= snakeSize) {
                        // check neighbours and decide which part should be applied
                        snakePartDecide(`${i}:${j}`)

                    }
                }

            }

            let loseScreen = document.getElementById("loseScreen")
            loseScreen.style.display = "flex"

            let result = document.getElementById("result")
            result.innerHTML = `Gratulacje przegrałeś!!!, twój wynik to: ${snakeSize}`
        }

        playArray[snakeHeadX][snakeHeadY] = 1

        // clear all classes except fruit
        for (let i = 1; i < size + 1; i++) {
            for (let j = 1; j < size + 1; j++) {
                if (playArray[i][j] != "f") {
                    let cellDom = document.getElementById(`${i}:${j}`)
                    cellDom.className = ""
                }

            }
        }

        // 
        // classes for snake image segments
        // 

        // here head
        if (snakeDirection == "up") {
            snakeHeadDom.className = "headUp"
        }
        else if (snakeDirection == "down") {
            snakeHeadDom.className = "headDown"
        }
        else if (snakeDirection == "left") {
            snakeHeadDom.className = "headLeft"
        }
        else if (snakeDirection == "right") {
            snakeHeadDom.className = "headRight"
        }

        // clear remaining cells
        for (let i = 0; i < size + 2; i++) {
            for (let j = 0; j < size + 2; j++) {
                if (playArray[i][j] == 0) {
                    let cellDom = document.getElementById(`${i}:${j}`)
                    cellDom.style.backgroundColor = "white"
                    cellDom.className = ""
                }

                // check if has snake part on it

                let playNubmer = parseInt(playArray[i][j])
                if (playNubmer > 1 && playNubmer <= snakeSize) {
                    // check neighbours and decide which part should be applied
                    snakePartDecide(`${i}:${j}`)

                }
            }

        }

        function snakePartDecide(coords) {
            coords = coords.split(":")

            let x = parseInt(coords[0])
            let y = parseInt(coords[1])

            let thisNumber = playArray[x][y]

            let upNumber = playArray[x - 1][y]
            let downNumber = playArray[x + 1][y]
            let leftNumber = playArray[x][y - 1]
            let rightNumber = playArray[x][y + 1]

            let cellDom = document.getElementById(`${x}:${y}`)

            cellDom.className = ""

            if (thisNumber == snakeSize || (hitFruit && thisNumber == snakeSize - 1)) {
                console.log("end", cellDom);

                // we have a tail
                if (thisNumber - 1 == upNumber) {
                    cellDom.className = "tailUp"
                }
                else if (thisNumber - 1 == downNumber) {
                    cellDom.className = "tailDown"
                }
                else if (thisNumber - 1 == rightNumber) {
                    cellDom.className = "tailRight"
                }
                else if (thisNumber - 1 == leftNumber) {
                    cellDom.className = "tailLeft"
                }

                // and here is a case when we hit 1 part before tail
                else if (upNumber == 1) {
                    cellDom.className = "tailUp"
                }
                else if (downNumber == 1) {
                    cellDom.className = "tailDown"
                }
                else if (leftNumber == 1) {
                    cellDom.className = "tailLeft"
                }
                else if (rightNumber == 1) {
                    cellDom.className = "tailRight"
                }

                hitFruit = false
            }
            else {
                // intersection or body
                console.log(thisNumber, "this number in decision");
                if (thisNumber - 1 == upNumber) {
                    if (thisNumber + 1 == rightNumber) {
                        cellDom.className = "turnUR"
                    }
                    else if (thisNumber + 1 == leftNumber) {
                        cellDom.className = "turnLU"
                    }
                    else {
                        cellDom.className = "bodyUp"
                    }
                }
                else if (thisNumber - 1 == downNumber) {
                    if (thisNumber + 1 == leftNumber) {
                        cellDom.className = "turnDL"
                    }
                    else if (thisNumber + 1 == rightNumber) {
                        cellDom.className = "turnRD"
                    }
                    else {
                        cellDom.className = "bodyUp"
                    }
                }
                else if (thisNumber - 1 == rightNumber) {
                    if (thisNumber + 1 == downNumber) {
                        cellDom.className = "turnRD"
                    }
                    else if (thisNumber + 1 == upNumber) {
                        cellDom.className = "turnUR"
                    }
                    else {
                        cellDom.className = "bodyRight"
                    }
                }
                else if (thisNumber - 1 == leftNumber) {
                    if (thisNumber + 1 == upNumber) {
                        cellDom.className = "turnLU"
                    }
                    else if (thisNumber + 1 == downNumber) {
                        cellDom.className = "turnDL"
                    }
                    else {
                        cellDom.className = "bodyRight"
                    }
                }
                // here for the dead snake part, when self hits
                // we have to go the other way round because thisNuber - 1 doesn't exist in playArr
                else if (thisNumber + 1 == downNumber || thisNumber + 1 == upNumber) {
                    cellDom.className = "bodyUp"
                }
                else if (thisNumber + 1 == rightNumber || thisNumber + 1 == leftNumber) {
                    cellDom.className = "bodyRight"
                }
            }
        }

        // check if hit wall
        if (snakeHeadDom.innerHTML == "x") {
            alert("Uderzyłeś w ściane! koniec gry")
            snakeHeadDom.style.backgroundColor = "red"
            clearInterval(inetrval)

            let loseScreen = document.getElementById("loseScreen")
            loseScreen.style.display = "flex"

            let result = document.getElementById("result")
            result.innerHTML = `Gratulacje przegrałeś!!! <br> <br> twój wynik to: ${snakeSize}`
        }

        console.log(playArray);
    }
})