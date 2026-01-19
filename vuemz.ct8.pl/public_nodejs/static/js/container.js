class Container {
    constructor() {
        this.obj = new THREE.Object3D()
        this.obj.name = "obj"
    }

    getContainer() {
        return this.obj
    }
}