class Player {

    constructor(x, y, z) {

        this.container = new THREE.Object3D()

        const geometry = new THREE.BoxGeometry(10, 10, 10, 2, 2, 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0x0d61de,
            side: THREE.DoubleSide,
            wireframe: true,
            transparent: false,
            opacity: 0.5
        });
        this.player = new THREE.Mesh(geometry, material); // player sześcian

        this.player.name = "player"

        this.container.add(this.player) // kontener w którym jest player

        this.axes = new THREE.AxesHelper(30) // osie konieczne do kontroli kierunku ruchu

        this.container.add(this.axes)

        this.container.position.set(x, y, z)
    }



    //funkcja zwracająca cały kontener

    getPlayerCont() {
        return this.container
    }

    //funkcja zwracająca playera czyli sam sześcian

    getPlayerMesh() {
        return this.player
    }

    //funkcja zwracająca Axes

    getPlayerAxes() {
        return this.axes
    }

}