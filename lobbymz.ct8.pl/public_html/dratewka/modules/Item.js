export class Item {
    id;
    pickedUpName;
    pickupable;
    locationName;
    constructor(id, locationName, pickupable, pickedUpName) {
        this.id = id
        this.pickedUpName = pickedUpName
        this.pickupable = pickupable
        this.locationName = locationName
    }
    show(comma) {
        let items = document.getElementById("items")

        // check if we need a comma
        if (comma) {
            items.innerHTML += ", " + this.locationName + " "
        }
        else {
            items.innerHTML += this.locationName
        }
    }
}