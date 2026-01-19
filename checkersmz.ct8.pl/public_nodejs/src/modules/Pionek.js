import { CylinderGeometry, Mesh, } from "three"
import { Settings } from "./Settings"

export default class Pionek extends Mesh {
    constructor(color, scene, x, z) {

        super()

        this.geometry = new CylinderGeometry(4, 4, 3, 30, 20)

        if (color == "white") {
            this.material = Settings.whitePionekMaterial
            this.name = "whitePionek"
        }
        else {
            this.material = Settings.blackPionekMaterial
            this.name = "blackPionek"
        }

        // classify this as a pionek
        this.pionek = "1"

        this.position.set(x, 2, z)

        scene.add(this)

    }
}