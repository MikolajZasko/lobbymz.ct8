// generowanie statków komputera
// 
// 
window.addEventListener("load", function () {
    // create table and array
    // 
    // settings
    let size = 10
    let amountOfShips = [1, 2, 3, 4]   // how many different ships there are

    // 
    let placedShips = 0

    let allCoords = []

    let comp = document.getElementById("comp")

    // console.log(comp);

    for (let i = 0; i < (size + 2); i++) {
        allCoords.push([])
        let tr = this.document.createElement("tr")
        tr.id = `row${i}`
        for (let j = 0; j < (size + 2); j++) {
            allCoords[i][j] = 0
            let td = this.document.createElement("td")
            td.innerHTML = `${i}:${j}`
            // td.id = `cell${j}`

            // change the display of border cells
            if (i == 0 || i == size + 1 || j == 0 || j == size + 1) {
                // td.style.backgroundColor = "grey"
                td.style.display = "none"
            }
            else {
                // td.className = "whiteText"
                td.addEventListener("click", playerShoot)
            }

            tr.append(td)
        }
        comp.append(tr)
    }

    // console.log(allCoords);

    // randomize the placement of ships
    // 
    // for each ship type
    for (let i = 0; i < amountOfShips.length; i++) {
        const element = amountOfShips[i];

        // for each ship
        for (let j = 0; j < element; j++) {
            let reRol = true
            while (reRol) {

                // if direction is 0 we place ship like:
                // ----
                // if direction is 1 we place ship like:
                // |
                // |
                // |
                // |

                let masts = (4 - i)

                let direction = Math.floor(Math.random() * 2);
                // let direction = 1

                let rowNum
                let cellNum

                if (direction == 1) {
                    rowNum = Math.floor(Math.random() * (size - masts)) + 1;
                    cellNum = Math.floor(Math.random() * size) + 1;
                }
                else {
                    rowNum = Math.floor(Math.random() * size) + 1;
                    cellNum = Math.floor(Math.random() * size) + 1;
                }

                // check if selected parameters are available

                if (list = freeSpace(rowNum, cellNum, masts, direction)) {

                    // console.log(list);

                    // occupty the fields around
                    for (let h = 0; h < list.length; h++) {
                        const element = list[h];

                        // console.log(element);
                        // console.log(allCoords[element[0]]);

                        allCoords[element[0]][element[1]] = 1
                    }


                    // fill the backgrounds
                    if (direction == 0) {
                        for (let h = 0; h < masts; h++) {

                            let rowDom = this.document.getElementById(`row${rowNum}`)
                            let cellDom = rowDom.children[cellNum]

                            // occupy the fields that ships are on
                            allCoords[rowNum][cellNum] = 2

                            cellNum += 1

                            // cellDom.style.backgroundColor = "red"
                        }
                    }
                    else {
                        for (let h = 0; h < masts; h++) {

                            let rowDom = this.document.getElementById(`row${rowNum}`)
                            let cellDom = rowDom.children[cellNum]

                            // occupy the fields that ships are on
                            allCoords[rowNum][cellNum] = 2

                            rowNum += 1

                            // cellDom.style.backgroundColor = "red"
                        }
                    }

                    reRol = false
                    placedShips += 1
                }
                else {
                    // re-rol the params
                    console.log("re-rol");
                    reRol = true
                }
            }
        }


        console.log(allCoords)
        console.log("placed ships", placedShips, "/", 10);

        if (placedShips == 1) {
            console.log("reset, nie postawił 4");
        }
        else if (placedShips <= 3) {
            console.log("reset, nie postawione 3");
        }
        else if (placedShips <= 6) {
            console.log("nie postawione 2");
        }
        else if (placedShips <= 9) {
            console.log("zostały 1");
        }
        else {
            console.log("udało się!!!");
        }

    }


    function freeSpace(row, cell, masts, direction) {
        console.log("masts in function", masts);
        console.log("row in function", row);
        console.log("cell in function", cell);
        let coordsAroundShip = []

        // check if there is free space
        for (let i = 0; i < masts; i++) {
            if (direction == 0) {
                if (allCoords[row][cell + i] == 1) {
                    return false
                }

            }
            else {
                if (allCoords[row + i][cell] == 1) {
                    return false
                }
            }
        }

        row -= 1
        cell -= 1

        // 
        // fill the 1 in 2d array
        // 
        if (direction == 0 && allCoords[row + 1][cell + 1 + masts] == 0) {

            for (let i = row; i < (row + 3); i++) {

                for (let j = cell; j < (cell + (2 + masts)); j++) {
                    // console.log(i, j);

                    coordsAroundShip.push([i, j])


                }
            }

            return coordsAroundShip
        }

        else if (direction == 1 && allCoords[row + 1 + masts][cell + 1] == 0) {
            for (let i = row; i < (row + 2 + masts); i++) {

                for (let j = cell; j < (cell + 3); j++) {
                    // console.log(i, j);
                    coordsAroundShip.push([i, j])

                }
            }

            return coordsAroundShip
        }
    }






    // player table
    // 
    // 

    let move = false
    let playerTable = this.document.getElementById("player")
    let playerCoords = []
    let playerSelectedShip
    let shipRotation = true
    let lastCell, onPlayerTable, firstCell
    let shipOnPlayerBoard = false
    let coordsAroundPlayerShip = []
    let coordsPlayerShip = []
    let gameStarted = false
    let playerTurn = false
    let turnInfoBox = this.document.getElementById("turnInfoBox")
    let playerDown = []
    let compDown = []
    let gameFinished = false

    playerTable.addEventListener("mouseover", function () {
        onPlayerTable = true
    })
    playerTable.addEventListener("mouseleave", function () {
        onPlayerTable = false
    })

    for (let i = 0; i < (size + 2); i++) {
        playerCoords.push([])
        let tr = this.document.createElement("tr")
        tr.id = `rowP${i}`
        for (let j = 0; j < (size + 2); j++) {
            playerCoords[i][j] = 0
            let td = this.document.createElement("td")
            td.innerHTML = `${i}:${j}`

            // change the display of border cells
            if (i == 0 || i == size + 1 || j == 0 || j == size + 1) {
                // td.style.backgroundColor = "grey"
                td.style.display = "none"
            }
            else {
                td.addEventListener("mouseover", function () { playerPlace(this, "green") })
                td.addEventListener("mouseleave", function () { playerPlace(this, "white") })
                td.addEventListener("click", function () { playerClick(this) })
                // td.className = "whiteText"
                // td.setAttribute("style", "color:white;")
            }

            tr.append(td)
        }
        playerTable.append(tr)
    }

    // gen ship divs

    let shipsDiv = this.document.getElementById("ships")

    for (let i = 4; i > 0; i--) {
        // console.log("masts: ", i);

        for (let j = 1; j <= amountOfShips[4 - i]; j++) {
            // console.log("ship number:", j);

            let div = this.document.createElement("div")
            div.className = "ship"

            div.style.width = `${i * 30}px`
            // div.setAttribute('style', `width:;`)

            for (let h = 0; h < i; h++) {
                let block = this.document.createElement("div")
                block.className = "block"

                div.append(block)
            }

            div.addEventListener("click", shipClick)
            // div.addEventListener("mousemove", shipMove)

            shipsDiv.append(div)

        }

    }

    function freeSpacePlayer(firstCell) {

        firstCell = firstCell.innerHTML.split(":")

        let row = parseInt(firstCell[0])
        let cell = parseInt(firstCell[1])

        let masts = playerSelectedShip.children.length

        // console.log(masts);

        // check if there is free space
        for (let i = 0; i < masts; i++) {
            if (shipRotation) {
                if (playerCoords[row][cell + i] != 0) {
                    return false
                }

            }
            else {
                if (playerCoords[row + i][cell] != 0) {
                    return false
                }
            }
        }

        return true
    }

    function playerClick(el) {
        // console.log(el);

        let playerTable = document.getElementById("player")

        let rows = playerTable.children

        // get the first cell
        let first = true
        let isFree

        for (let i = 0; i < rows.length; i++) {
            const element = rows[i];

            let cells = element.children

            for (let j = 0; j < cells.length; j++) {
                const element = cells[j];

                const cssObj = window.getComputedStyle(element, null);

                let bgColor = cssObj.getPropertyValue("background-color");

                // console.log(bgColor);

                if (bgColor == "rgb(0, 128, 0)") {
                    // console.log("we make it blue");

                    if (first) {
                        first = false
                        firstCell = element
                        isFree = freeSpacePlayer(firstCell)
                        console.log(isFree);
                    }

                    if (isFree) {
                        element.style.backgroundColor = "blue"

                        shipOnPlayerBoard = true

                        playerSelectedShip.remove()

                        // now change the array value to 2,
                        // we do that in order to distinguish ship from space around ship

                        let cellHtml = element.innerHTML.split(":")

                        coordsPlayerShip.push(cellHtml)

                    }
                    else {
                        console.log("occupied");
                    }

                }


            }

        }
        console.log(playerCoords);
        if (isFree) {
            // console.log(shipRotation);

            let masts = playerSelectedShip.children.length

            // console.log(firstCell);

            let firstCellCoords = firstCell.innerHTML.split(":")

            // console.log(firstCellCoords);

            let row = parseInt(firstCellCoords[0] - 1)
            let cell = parseInt(firstCellCoords[1] - 1)

            // 
            // fill the 1 in 2d array
            // 


            if (shipRotation == true) {
                console.log("direction = true");

                for (let i = row; i < (row + 3); i++) {

                    for (let j = cell; j < (cell + (2 + masts)); j++) {
                        // console.log(i, j);

                        coordsAroundPlayerShip.push([i, j])


                    }
                }

                // return coordsAroundShip
            }

            else if (shipRotation == false) {
                console.log("direction = false");

                for (let i = row; i < (row + 2 + masts); i++) {

                    for (let j = cell; j < (cell + 3); j++) {
                        // console.log(i, j);
                        coordsAroundPlayerShip.push([i, j])

                    }
                }

                // return coordsAroundShip
            }
            else if (masts == 1) {
                console.log("masts == 1");
                for (let i = row; i < row + 3; i++) {

                    for (let j = cell; j < cell + 3; j++) {
                        console.log(i, j);
                        coordsAroundPlayerShip.push([i, j])

                    }
                }
            }

            ocupy(coordsAroundPlayerShip)

            shipRotation = true
        }

        // console.log(playerCoords);
        checkIfAllPlaced()
    }

    function ocupy(arr) {
        console.log(arr);
        for (let h = 0; h < arr.length; h++) {
            const element = arr[h];

            playerCoords[element[0]][element[1]] = 1

        }
        for (let h = 0; h < coordsPlayerShip.length; h++) {

            let cellHtml = coordsPlayerShip[h]

            let cellRow = parseInt(cellHtml[0])
            let cellCell = parseInt(cellHtml[1])

            playerCoords[cellRow][cellCell] = 2

        }
        coordsAroundPlayerShip = []
        coordsPlayerShip = []
    }

    function playerPlace(el, color) {
        // console.log(color);
        lastCell = el
        // console.log(el);
        if (move && shipOnPlayerBoard == false) {

            let masts = playerSelectedShip.children.length
            let coords = el.innerHTML.split(":")
            let playerTable = document.getElementById("player")

            let row = parseInt(coords[0])
            let cell = parseInt(coords[1])

            let first = true
            let firstCell

            // default rotation
            if (shipRotation) {


                while (playerCoords[row][cell + masts] == undefined) {
                    // console.log("za daleko");
                    cell -= 1
                }


                for (let i = 1; i < masts + 1; i++) {
                    let element = playerTable.children[row].children[cell];

                    if (first) {
                        firstCell = element
                        first = false
                        // console.log(firstCell);
                    }

                    // if (element.style.backgroundColor != "blue") {
                    //     element.style.backgroundColor = color

                    //     if (color == "white") {
                    //         element.style.backgroundColor = color
                    //     }
                    //     else if (freeSpacePlayer(firstCell) != true) {
                    //         element.style.backgroundColor = "red"
                    //     }
                    // }

                    if (element.style.backgroundColor == "blue") {
                        element.className = "placed"
                    }
                    element.style.backgroundColor = color

                    if (color == "white") {
                        element.style.backgroundColor = color
                        if (element.className == "placed") {
                            element.style.backgroundColor = "blue"
                        }
                    }
                    else if (freeSpacePlayer(firstCell) != true) {
                        element.style.backgroundColor = "red"
                    }

                    cell += 1

                }
            }
            else {
                while (playerCoords[row + masts]?.[cell] == undefined) {
                    console.log("za daleko");
                    row -= 1
                }


                for (let i = 1; i < masts + 1; i++) {
                    let element = playerTable.children[row].children[cell];

                    if (first) {
                        firstCell = element
                        first = false
                        console.log(firstCell);
                    }

                    if (element.style.backgroundColor == "blue") {
                        element.className = "placed"
                    }
                    element.style.backgroundColor = color

                    if (color == "white") {
                        element.style.backgroundColor = color
                        if (element.className == "placed") {
                            element.style.backgroundColor = "blue"
                        }
                    }
                    else if (freeSpacePlayer(firstCell) != true) {
                        element.style.backgroundColor = "red"
                    }

                    row += 1

                }
            }

        }
    }

    window.addEventListener("contextmenu", function (event) {
        event.preventDefault()

        if (onPlayerTable) {
            playerPlace(lastCell, "white")

            if (shipRotation) {
                shipRotation = false
            }
            else {
                shipRotation = true
            }

            playerPlace(lastCell, "green")
        }

        console.log("menu");
    });

    function shipClick() {

        // delete all background colors for kids
        let blocks = document.getElementsByClassName("block")

        // activate the mouseover on player table
        move = true

        for (let i = 0; i < blocks.length; i++) {
            const element = blocks[i];

            element.style.backgroundColor = "transparent"
            // element.setAttribute('style', 'background-color:grey;')

        }

        for (let i = 0; i < ships.children.length; i++) {
            const element = ships.children[i];

            element.style.hover

        }

        // give every kid background color blue
        for (let i = 0; i < this.children.length; i++) {
            const element = this.children[i];

            element.style.backgroundColor = "blue"
            // element.setAttribute('style', 'background-color:blue;')

            // console.log(element);

        }

        shipOnPlayerBoard = false

        playerSelectedShip = this
    }

    function checkIfAllPlaced() {
        let ships = document.getElementById("ships")

        let startGameDiv = document.getElementById("startGameDiv")

        if (ships.children.length <= 0 && startGameDiv.children.length != 1) {
            let startGameButton = document.createElement("button")

            startGameButton.id = "startGame"
            startGameButton.innerHTML = "startGame"

            startGameButton.addEventListener("click", startGame)

            let startGameDiv = document.getElementById("startGameDiv")

            startGameDiv.append(startGameButton)

            let ships = this.document.getElementById("ships")
            ships.style.display = "none"
        }
    }

    // start the selection with 4 mast ship

    let ships = this.document.getElementById("ships")
    let ship1child = ships.children[0]

    ship1child.click()

    // triggers when the button with id "startGame" is pressed

    function startGame() {
        console.log("the game has started");

        this.style.display = "none"

        gameStarted = true
        playerTurn = true

        turnInfoBox.innerHTML = "Ruch Gracza 😎"
        turnInfoBox.style.backgroundColor = "red"
    }

    // shooting 
    // 
    // this is triggered after every player move

    let compShot = []

    function computerShoot() {
        if (!gameFinished) {
            let row = Math.floor((Math.random() * 10) + 1);
            let cell = Math.floor((Math.random() * 10) + 1);

            let coord = row + "-" + cell

            if (compShot.includes(coord)) {
                computerShoot()
            }
            else {
                let rowDOM = document.getElementById(`rowP${row}`)
                let cellDom = rowDOM.children[cell]

                compShot.push(coord)

                if (playerCoords[row][cell] == 2) {
                    playerTurn = false
                    turnInfoBox.innerHTML = "Ruch Komputera 🤓"
                    turnInfoBox.style.backgroundColor = "blue"
                    cellDom.className = "trafiony"
                    compDown.push(cellDom.innerHTML)
                    console.log(cellDom.innerHTML);
                    setTimeout(computerShoot, 1000)
                }
                else {
                    playerTurn = true
                    cellDom.className = "pudlo"
                    turnInfoBox.innerHTML = "Ruch Gracza 😎"
                    turnInfoBox.style.backgroundColor = "red"
                }
                checkIfWon()
            }
        }

    }

    let playerShotsList = []

    // this is on each cell on computer map click
    function playerShoot() {
        if (gameFinished) {
            alert("koniec gry 0_0")
        }
        else if (!gameStarted) {
            alert("najpierw rozstaw statki i rozpocznij grę >:(")
        }
        else if (playerTurn) {
            let coords = this.innerHTML.split(":")

            let row = coords[0]
            let cell = coords[1]

            let coordString = `${row}-${cell}`

            if (playerShotsList.includes(coordString)) {
                alert("EEEEEEEEEEEEEEEEEEEEE tu już strzeliłeś >:(")
            }
            else {
                if (allCoords[row][cell] == 2) {
                    console.log("trafiony!");
                    this.className = "trafiony"
                    playerDown.push(this.innerHTML)
                    console.log(this.innerHTML);
                    playerTurn = true
                    turnInfoBox.innerHTML = "Ruch Gracza 😎"
                    turnInfoBox.style.backgroundColor = "red"
                }
                else {
                    console.log("pudło!");
                    this.className = "pudlo"
                    playerTurn = false
                    turnInfoBox.innerHTML = "Ruch Komputera 🤓"
                    turnInfoBox.style.backgroundColor = "blue"
                    setTimeout(computerShoot, 1000)
                }

                playerShotsList.push(coordString)
                checkIfWon()
            }

        }
        else {
            alert("ruch komputera")
        }

    }

    function checkIfWon() {
        if (playerDown.length >= 20) {
            console.log("player zwyciężył!!!");
            gameFinished = true

            let winScreen = document.getElementById("winScreen")
            winScreen.style.display = "flex"

            let turnInfoBox = document.getElementById("turnInfoBox")
            turnInfoBox.style.display = "none"

            showCompShips()
        }
        else if (compDown.length >= 20) {
            console.log("comp zwyciężył!!!");
            gameFinished = true

            let loseScreen = document.getElementById("loseScreen")
            loseScreen.style.display = "flex"

            let turnInfoBox = document.getElementById("turnInfoBox")
            turnInfoBox.style.display = "none"

            showCompShips()
        }


    }

    function showCompShips() {
        for (let i = 0; i < size + 2; i++) {
            let tr = document.getElementById(`row${i}`)
            let row = tr.children
            for (let j = 0; j < size + 2; j++) {
                let cell = row[j]

                if (allCoords[i][j] == 2) {
                    cell.style.backgroundColor = "red"

                }

            }

        }
    }

})