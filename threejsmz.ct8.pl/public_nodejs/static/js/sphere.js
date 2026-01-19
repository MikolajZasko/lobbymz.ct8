class Sphere {
    constructor(x, y, z) {
        const geometry = new THREE.SphereGeometry(2, 10, 10);
        const material = new THREE.MeshBasicMaterial({
            color: 0xfc0303,
            side: THREE.DoubleSide,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        this.sphere = new THREE.Mesh(geometry, material);

        this.sphere.position.set(x, y - 6, z)

        this.sphere.name = "sphere"

    }

    getSphere() {
        return this.sphere
    }
}