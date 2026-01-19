class Ally {

    constructor(x, y, z, scene) {

        this.container = new THREE.Object3D()

        const geometry = new THREE.SphereGeometry(8, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0x28ff03,
            side: THREE.DoubleSide,
            wireframe: true,
            transparent: false,
            opacity: 0.5
        });
        this.ally = new THREE.Mesh(geometry, material);

        this.ally.name = "ally"

        this.container.add(this.ally) // kontener w którym jest ally

        this.axes = new THREE.AxesHelper(30) // osie konieczne do kontroli kierunku ruchu

        this.container.add(this.axes)

        this.container.position.set(x, y, z)

        this.follow = false

        scene.add(this.getAllyCont())
    }



    //funkcja zwracająca cały kontener

    getAllyCont() {
        return this.container
    }

    //funkcja zwracająca Allya czyli sam sześcian

    getAllyMesh() {
        return this.ally
    }

    //funkcja zwracająca Axes

    getAllyAxes() {
        return this.axes
    }

    tryFollow(obj) {
        if (!this.isFollowing()) { return }
        console.log(obj);
        let ally = this
        // distance
        // 
        // find current player coords
        let objCoords

        // obj that we follow is a player
        if (obj.player != undefined) {

            objCoords = obj.getPlayerCont().position

        }
        // obj that we follow is an ally
        else {
            objCoords = obj.getAllyCont().position
        }

        // console.log(objCoords);
        let dist = ally.getAllyCont().position.clone().distanceTo(objCoords)

        // console.log(dist);

        if (Math.round(dist) >= 15) {

            let angle = Math.atan2(
                ally.getAllyCont().position.clone().x - objCoords.x,
                ally.getAllyCont().position.clone().z - objCoords.z
            )

            ally.getAllyMesh().rotation.y = angle
            ally.getAllyAxes().rotation.y = (angle + (1.57 * 2))

            let directionVectAlly = objCoords.clone().sub(ally.getAllyCont().position).normalize() // sub - > odejmij pozycję playera od pozycji kliknięcia

            ally.getAllyCont().translateOnAxis(directionVectAlly, 1) // 5 - przewidywany speed czyli względna szybkość ruchu po planszy

        }


    }


    isFollowing() {
        return this.getAllyMesh().following
    }

}