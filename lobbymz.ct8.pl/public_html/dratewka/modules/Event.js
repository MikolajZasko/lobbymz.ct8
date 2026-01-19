// import { game } from "./game.js";
import { data } from "./data.js";

export class Event {
    itemId;
    location;
    outcomeItemId;
    message;
    specialEvent;
    timeoutMessages;
    constructor(itemId, location, outcomeItemId, message, specialEvent = false, timeoutMessages = false) {
        this.itemId = itemId
        this.location = location
        this.outcomeItemId = outcomeItemId.toString()
        this.message = message
        this.specialEvent = specialEvent
        this.timeoutMessages = timeoutMessages
    }
    init() {
        // run the event
        // 
        // check if dragon has to be killed in order to run the event
        if (this.specialEvent == "isDragonDead") {
            if (data.dragonIsDead == true) {
                // we proceed with the event
                this.startEvent()
                return true
            }
            else {
                // we stop the event and "nothing happends"
                return false
            }
        }
        else {
            // we proceed with the event
            this.startEvent()
            return true
        }


    }
    startEvent() {
        console.log("STARTEVENT");

        // check if this is the last event
        if (this.location == "none") {
            location.href = "introPhotos/win.webp"
        }
        else {
            // remove item from hand
            data.heldItem = "nothing"

            // check if pickupable
            console.log(this.outcomeItemId[0]);
            const outcomeItemX = parseInt(this.outcomeItemId[0])
            const outcomeItemY = parseInt(this.outcomeItemId[1])

            const pickupableOutcome = data.items[outcomeItemX][outcomeItemY].pickupable
            const itemNameOutcome = data.items[outcomeItemX][outcomeItemY].pickedUpName

            if (pickupableOutcome == 1) {
                // if pickupable give item to hand
                data.heldItem = itemNameOutcome

                // update html
                this.updateHeldItems()
            }
            else {
                // if not place item on location
                data.locations[data.x][data.y].items.push(this.outcomeItemId)

                // initialize the given location 
                data.locations[data.x][data.y].init()

                // update html
                this.updateHeldItems()
            }

            // check if special events are involved
            if (this.specialEvent == "dragonIsDead") {
                data.dragonIsDead = true
                data.heldItem = "nothing"

                // change location graphic
                data.locations[4][3].src = "introPhotos/dragon.bmp"

                this.updateHeldItems()
            }
            else if (this.specialEvent == "OK") {
                data.sheepPartsCounter += 1
            }

            // check if we collected all speep parts
            if (data.sheepPartsCounter == 6 && data.sheepSpawned == false) {
                this.sheepSpawn()
                data.sheepSpawned = true
            }
        }

    }
    updateHeldItems() {
        let carry = document.getElementById("carry")
        carry.innerHTML = data.heldItem
    }
    sheepSpawn() {
        // delete all sheep items from 4 3
        let trapLocationItems = data.locations[4][3].items

        console.log();
        console.log("trapLocationItems", trapLocationItems);
        console.log();


        // delete items: 13 17 20 23 26 29
        let newItemList = []
        trapLocationItems.forEach(itemId => {
            if (itemId != 13 && itemId != 17 && itemId != 20 && itemId != 23 && itemId != 26 && itemId != 29) {
                // add item to new list
                newItemList.push(itemId)
            }
        });

        // update location items
        data.locations[4][3].items = newItemList

        // hive player to hand fake sheep
        data.heldItem = "SHEEP"

        // update html
        this.updateHeldItems()
    }
}