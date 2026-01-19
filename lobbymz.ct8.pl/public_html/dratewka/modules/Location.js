import { data } from "./data.js";

export class Location {
    name;
    src;
    items;
    color;
    dir;
    constructor(name, src, color, dir, items = []) {
        // here what???
        this.name = name
        this.src = src
        this.color = color
        this.dir = dir
        this.items = items

    }
    init() {
        // log location coords
        console.log("location coords", data.x, data.y);

        // change the title
        let title = document.getElementById("title")
        title.innerHTML = this.name

        // change the image
        let image = document.getElementById("loactionImage")
        image.src = this.src

        // change the color of an image
        image.style.backgroundColor = this.color

        // hide all directions
        let cw = document.getElementById("cw")
        let cn = document.getElementById("cn")
        let cs = document.getElementById("cs")
        let ce = document.getElementById("ce")

        cw.style.display = "block"
        cn.style.display = "block"
        cs.style.display = "block"
        ce.style.display = "block"

        // set directions in html
        let domDir = document.getElementById("direction")

        let dirText = "You can go "
        for (let i = 0; i < 4; i++) {
            const element = this.dir[i];
            if (element == "S") {
                dirText += "SOUTH, "
                cs.style.display = "none"
            }
            else if (element == "W") {
                dirText += "WEST, "
                cw.style.display = "none"
            }
            else if (element == "N") {
                dirText += "NORTH, "
                cn.style.display = "none"
            }
            else if (element == "E") {
                dirText += "EAST, "
                ce.style.display = "none"
            }
            // check if requirements were met
            else if (element == "E?") {
                dirText += "EAST, "
                ce.style.display = "none"
            }
            else if (element == "W?") {
                dirText += "WEST, "
                cw.style.display = "none"
            }
        }

        domDir.innerHTML = dirText

        let items = document.getElementById("items")

        // set seen items
        if (this.items.length >= 1) {
            // clear items
            items.innerHTML = ""

            // find item
            for (let j = 0; j < this.items.length; j++) {
                let itemId = this.items[j].toString();
                itemId = itemId.split("")
                let x = itemId[0]
                let y = itemId[1]

                // show the item
                if (j == 0) {
                    data.items[x][y].show(false)
                }
                else {
                    data.items[x][y].show(true)
                }

            }
        }
        else {
            items.innerHTML = "nothing"
        }
    }
}