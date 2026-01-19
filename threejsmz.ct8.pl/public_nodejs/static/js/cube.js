class Cube {
    constructor(x, y, z) {
        const geometry = new THREE.BoxGeometry(10, 10, 10, 2, 2, 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0x8888ff,
            side: THREE.DoubleSide,
            wireframe: true,
            transparent: false,
            opacity: 0.5
        });

        this.cube = new THREE.Mesh(geometry, material);
        this.cube.position.set(x, y, z)

        if (x == 0 && y == 0 && z == 0) {
            this.cube.name = "cube"
        }

    }

    getCube() {
        return this.cube
    }
}