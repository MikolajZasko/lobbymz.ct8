import { data } from "./data.js"

export class Game {
    cursorIndex;
    // in ms
    gameSpeed = 700;
    constructor() {
        data.x = 4
        data.y = 7

        // setup basic variables for other classes to use
        this.status = "working"
        this.cursorindex = 0
    }
    init() {
        // initialize the given location 
        data.locations[data.x][data.y].init()

        this.updateHeldItems()
    }
    updateHeldItems() {
        let carry = document.getElementById("carry")
        carry.innerHTML = data.heldItem
    }
    move(direction) {
        // check if we can move to the direction the player wants from the current tile
        if (data.locations[data.x][data.y].dir.includes(direction)) {
            console.log("you can go: ", direction);

            // you move a tile 
            if (direction == "S") {
                data.x += 1

                this.init()
                return true
            }
            else if (direction == "W") {
                data.y -= 1

                this.init()
                return true
            }
            else if (direction == "N") {
                data.x -= 1

                this.init()
                return true
            }
            else if (direction == "E") {
                data.y += 1

                this.init()
                return true
            }
            // check if requirements were met
            else if (direction == "W?") {
                if (data.dragonIsDead) {
                    data.y -= 1

                    this.init()
                    return true
                }
                else {
                    return false
                }
            }

        }
        else {
            return false

            // nothing happends
        }
    }
    take(command) {
        // check if items are on current location
        if (data.locations[data.x][data.y].items.length != 0) {

            // get demanded item
            let playerDemandedItem = ""

            for (let i = 1; i < command.length; i++) {
                const element = command[i];
                playerDemandedItem += element
            }

            playerDemandedItem = playerDemandedItem

            let playerDemandedId = "none"

            // check id
            for (let j = 0; j < data.items.length; j++) {
                const array = data.items[j];
                for (let h = 0; h < array.length; h++) {
                    const item = array[h];

                    if (item.pickedUpName == playerDemandedItem) {
                        playerDemandedId = item.id
                    }
                }
            }
            // if item not found check if it is sheep part
            if (playerDemandedId == "none") {
                // if (playerDemandedItem) {

                // }
                console.log("nuugh");
                this.message(`Item ${playerDemandedItem} isn't here...`)
            }
            else {
                let locationItems = data.locations[data.x][data.y].items
                let itemFound = false

                for (let j = 0; j < locationItems.length; j++) {
                    let itemId = locationItems[j];
                    let itemIdSplit = itemId.toString().split("")
                    let x = itemIdSplit[0]
                    let y = itemIdSplit[1]

                    // compare id's
                    if (playerDemandedId == itemId) {
                        itemFound = true
                        // we can take the item
                        // check if we can pick it up
                        if (data.items[x][y].pickupable == 1) {
                            // we can pick it up

                            // check if already has something in hand
                            if (data.heldItem == "nothing") {
                                // we pick it up

                                this.message(`You pick up ${playerDemandedItem}`)

                                data.heldItem = playerDemandedItem

                                this.updateHeldItems()

                                // remove item from location
                                let index = locationItems.indexOf(playerDemandedId)
                                data.locations[data.x][data.y].items.splice(index, 1)

                                // update location data
                                this.init()

                                break
                            }
                            else {
                                this.message("your hands are full")
                                break
                            }
                        }
                        else {
                            this.message("you can't pick this up")
                            break
                        }
                    }
                }
                if (!itemFound) {
                    this.message(`Item ${playerDemandedItem} isn't here...`)
                }
            }

        }
        else {
            this.message("no items here...")
        }

    }
    drop(command) {
        // get demanded item
        let playerDemandedItem = ""

        for (let i = 1; i < command.length; i++) {
            const element = command[i];
            playerDemandedItem += element
        }

        playerDemandedItem = playerDemandedItem

        // check if we are holding the item that player wants to drop
        if (playerDemandedItem == data.heldItem) {
            // we have it
            let playerDemandedId = "none"

            // check amount of pickable items on current location (max 3)
            let pickupableItemsCounter = 0
            for (let j = 0; j < data.locations[data.x][data.y].items.length; j++) {
                let id = data.locations[data.x][data.y].items[j];
                id = id.toString()

                const itemX = id[0]
                const itemY = id[1]

                const itemObject = data.items[itemX][itemY]
                const pickupable = itemObject.pickupable

                // if we find a pickupable item on current location, add 1 to pickupableItemsCounter
                if (pickupable == 1) {
                    pickupableItemsCounter += 1
                }
            }

            // if we find 3 items that are pickupable on current location, we can't drop the item here
            if (pickupableItemsCounter >= 3) {
                this.message(`You can't drop more than 3 pickupable items here`)
            }
            else {
                // check id
                for (let j = 0; j < data.items.length; j++) {
                    const array = data.items[j];
                    for (let h = 0; h < array.length; h++) {
                        const item = array[h];

                        if (item.pickedUpName == playerDemandedItem) {
                            playerDemandedId = item.id
                        }
                    }
                }

                // add id to location
                data.locations[data.x][data.y].items.push(playerDemandedId)

                // remove item from inventory
                data.heldItem = "nothing"
                this.updateHeldItems()

                // add name of item to location / update location information
                this.init()

                this.message(`You dropped ${playerDemandedItem}`)
            }

        }
        else {
            this.message(`You dont have ${playerDemandedItem} in your inventory`)
        }

    }
    use(command) {
        // get demanded item
        let playerDemandedItem = ""

        for (let i = 1; i < command.length; i++) {
            const element = command[i];
            playerDemandedItem += element
        }

        playerDemandedItem = playerDemandedItem

        // check if we carry playerDemandedItem
        if (playerDemandedItem == data.heldItem) {
            // check id 
            let id
            for (let j = 0; j < data.items.length; j++) {
                const array = data.items[j];
                for (let h = 0; h < array.length; h++) {
                    const item = array[h];

                    if (item.pickedUpName == playerDemandedItem) {
                        id = item.id
                    }
                }
            }

            // check if given item id has any event
            const hasEvent = data.events.find(event => {

                return event.itemId == id
            })


            if (hasEvent == false || hasEvent == undefined) {
                // item doesn't have any interaction
                this.message(`Nothing happends`)
            }
            else {
                // check if on the right tile
                const eventLocation = hasEvent.location.toString()
                const currentLocation = `${data.x}${data.y}`

                if (eventLocation == currentLocation || eventLocation == "none") {
                    console.log("hasEvent", hasEvent);
                    // we use the item
                    let eventOutcome = hasEvent.init()

                    if (eventOutcome == false) {
                        // the event failed
                        this.message(`Nothing happends`)
                    }
                    else {
                        // we proceed with the event
                        // 
                        // display first message
                        this.message(hasEvent.message)

                        // check if there are any more messages
                        let moreMessages = hasEvent.timeoutMessages

                        if (moreMessages != false) {
                            setTimeout(() => {
                                this.timedOutMessage(moreMessages)
                            }, this.gameSpeed)
                        }

                        // update html
                        this.init()
                    }
                }
                else {
                    this.message(`Nothing happends`)
                }
            }


        }
        else {
            this.message(`You don't have ${playerDemandedItem} in your inventory`)
        }
    }
    gossips() {
        // hide game content
        let mainGame = document.getElementById("mainGame")

        mainGame.style.display = "none"

        // show gossips
        let gossips = document.getElementById("gossips")

        gossips.style.display = "block"

        // wait for key input
        this.status = "gossips"

        // with out this gossips / vocab disappear immediately
        this.pressedKeyCount = 1
    }
    vocabulary() {
        // hide game content
        let mainGame = document.getElementById("mainGame")

        mainGame.style.display = "none"

        // show vocabulary
        let vocabulary = document.getElementById("vocabulary")

        vocabulary.style.display = "block"

        // wait for key input
        this.status = "vocabulary"

        // with out this gossips / vocab disappear immediately
        this.pressedKeyCount = 1
    }
    run(command) {

        command = command.split(" ")

        // all to uppercase
        command.forEach((element, i) => {
            command[i] = element.toUpperCase()
        });

        console.log(command);

        console.log("held item", data.heldItem);

        if (command.length == 1) {
            // schoolcheats
            if (command[0].toUpperCase() == "ABC") {
                data.x = 4
                data.y = 3

                data.locations[4][3].items = [17, 20, 23, 26, 29]
                data.sheepPartsCounter = 5

                data.heldItem = "STICKS"

                this.updateHeldItems()

                data.locations[4][3].init()
            }
            if (command[0].toUpperCase() == "S" || command[0].toUpperCase() == "SOUTH") {
                if (this.move("S")) {
                    this.message("You are going south...")
                }
                else {
                    this.message("You can't go south")
                }

            }
            else if (command[0].toUpperCase() == "W" || command[0].toUpperCase() == "WEST") {
                if (this.move("W")) {
                    this.message("You are going west...")
                }
                else {
                    if (this.move("W?")) {
                        this.message("You are going west...")
                    }
                    else {
                        this.timedOutMessage(["You can't go that way... ", " The dragon sleeps in a cave! "])
                    }
                }

            }
            else if (command[0].toUpperCase() == "N" || command[0].toUpperCase() == "NORTH") {
                if (this.move("N")) {
                    this.message("You are going north...")
                }
                else {
                    this.message("You can't go north")
                }

            }
            else if (command[0].toUpperCase() == "E" || command[0].toUpperCase() == "EAST") {
                if (this.move("E")) {
                    this.message("You are going east...")
                }
                else {
                    this.message("You can't go east")
                }

            }
            else if (command[0].toUpperCase() == "G" || command[0].toUpperCase() == "GOSSIPS") {
                this.gossips()
            }
            else if (command[0].toUpperCase() == "V" || command[0].toUpperCase() == "VOCABULARY") {
                this.vocabulary()
            }
            else {
                this.message("Try another word or V for vocabulary")
            }
        }
        else if (command[0].toUpperCase() == "T" || command[0].toUpperCase() == "TAKE") {
            this.take(command)
        }
        else if (command[0].toUpperCase() == "D" || command[0].toUpperCase() == "DROP") {
            this.drop(command)
        }
        else if (command[0].toUpperCase() == "U" || command[0].toUpperCase() == "USE") {
            this.use(command)
        }
        else {
            this.message("Try another word or V for vocabulary")
        }

    }
    message(message) {

        this.status = "message"

        let consoleDiv = document.getElementById("consoleDiv")

        let savedInnerHtml = consoleDiv.innerHTML

        // hide all and display message
        consoleDiv.innerHTML = message

        // wait for gameSpeed variable and continue
        setTimeout(() => {
            // bring back status
            this.status = "working"

            // bring back content
            consoleDiv.innerHTML = savedInnerHtml

            // bring back focus
            let consoleDom = document.getElementById("console")
            consoleDom.focus()
            window.addEventListener("click", function (e) {
                // change the focus to our input
                consoleDom.focus()
            })

            // set letter interval / cursor interval to default
            this.cursorindex = 0

            // fix the position of cursor
            let cursor = document.getElementById("cursor")
            cursor.style.left = "300px"

            // clear the inner side of cursor
            cursor.innerHTML = "&nbsp;"
        }, this.gameSpeed)

    }
    timedOutMessage(messages) {
        this.status = "message"

        let consoleDiv = document.getElementById("consoleDiv")

        let savedInnerHtml = consoleDiv.innerHTML

        let messageNumber = 0

        messages.forEach(message => {
            setTimeout(() => {
                // hide all and display message
                consoleDiv.innerHTML = message
            }, this.gameSpeed * messageNumber)
            messageNumber += 1
        });

        let amountOfMessages = messages.length

        setTimeout(() => {
            // continue the game
            // 
            // bring back status
            this.status = "working"

            // bring back content
            consoleDiv.innerHTML = savedInnerHtml

            // bring back focus
            let consoleDom = document.getElementById("console")
            consoleDom.focus()
            window.addEventListener("click", function (e) {
                // change the focus to our input
                consoleDom.focus()
            })

            // set letter interval / cursor interval to default
            this.cursorindex = 0

            // fix the position of cursor
            let cursor = document.getElementById("cursor")
            cursor.style.left = "300px"

            // clear the inner side of cursor
            cursor.innerHTML = "&nbsp;"
        }, this.gameSpeed * amountOfMessages);

    }

}