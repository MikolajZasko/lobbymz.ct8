import { BoxGeometry, Mesh } from "three"
import { Settings } from "./Settings"

export default class Field extends Mesh {
    constructor(cell, scene, x, z) {

        super()

        this.geometry = new BoxGeometry(10, 2, 10)

        if (cell == 1) {
            this.material = Settings.whiteMaterial
            this.name = "whiteField"
        }
        else {
            this.material = Settings.blackMaterial
            this.name = "blackField"
        }

        this.position.set(x, 0, z)

        scene.add(this)

    }
}