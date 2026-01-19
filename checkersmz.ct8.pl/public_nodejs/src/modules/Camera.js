import { PerspectiveCamera, Vector3 } from 'three';

export default class Camera {
    constructor(renderer) {
        const width = renderer.domElement.width;
        const height = renderer.domElement.height;

        this.threeCamera = new PerspectiveCamera(70, width / height, 0.1, 10000);

        this.threeCamera.lookAt(new Vector3(90, 90, 90))

        // console.log(this.threeCamera.lookAt());

        this.threeCamera.position.set(35, 40, 110);

        this.updateSize(renderer);

        window.addEventListener('resize', () => this.updateSize(renderer), false);
    }

    updateSize(renderer) {

        this.threeCamera.aspect = renderer.domElement.width / renderer.domElement.height;
        this.threeCamera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    playerCamera(color) {

        if (color == "white") {
            this.threeCamera.position.set(35, 35, -30);
            // this.threeCamera.lookAt()
        }
        else {
            this.threeCamera.position.set(35, 35, 100);
            // this.threeCamera.lookAt()
        }

    }

}