let fov
let cube, sphere, cylinder, cone
let cubeVisible = false
let sphereVisible = false
let cylinderVisible = false
let coneVisible = false

$(document).ready(function rysowanko() {
    // scena 3D

    const scene = new THREE.Scene();

    // osie
    const axes = new THREE.AxesHelper(1000)
    scene.add(axes)

    const camera = new THREE.PerspectiveCamera(
        90,    // kąt patrzenia kamery (FOV - field of view)
        window.innerWidth / window.innerHeight,    // proporcje widoku, powinny odpowiadać proporcjom ekranu przeglądarki użytkownika
        0.1,    // minimalna renderowana odległość
        10000    // maksymalna renderowana odległość od kamery
    );

    // renderer wykorzystujący WebGL - działa stabilnie na wszystkich
    // najnowszych przeglądarkach zarówno desktopowych jak mobilnych

    const renderer = new THREE.WebGLRenderer();

    // kolor tła sceny - uwaga na prefix 0x a nie #

    renderer.setClearColor(0xffffff);

    // ustal rozmiary renderowanego okna w px (szer, wys)

    renderer.setSize(window.innerWidth, window.innerHeight);

    // dodanie renderera do diva, który istnieje na scenie

    document.getElementById("root").appendChild(renderer.domElement);

    camera.position.x = -200;
    camera.position.y = 200;
    camera.position.z = 200;

    // lub

    camera.position.set(100, 100, 100)

    // nakierowanie kamery na punkt (0,0,0) w przestrzeni (zakładamy, że istnieje już scena)

    camera.lookAt(scene.position);



    // kluczowy element - animacja

    function render() {


        //w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
        //np zmieniająca się wartość rotacji obiektu

        //wykonywanie funkcji bez końca, ok 60 fps jeśli pozwala na to wydajność maszyny

        requestAnimationFrame(render);

        // potwierdzenie w konsoli, że render się wykonuje

        console.log("render leci")

        // sprawdza czy widać figurę i nią kręci
        if (cubeVisible == true) {
            cube.rotation.y += 0.01;
        }
        if (sphereVisible == true) {
            sphere.rotation.y += 0.01;
        }
        if (cylinderVisible == true) {
            cylinder.rotation.y += 0.01;
        }
        if (coneVisible == true) {
            cone.rotation.y += 0.01;
        }

        //ciągłe renderowanie / wyświetlanie widoku sceny naszą kamerą

        renderer.render(scene, camera);
    }

    // na koniec jednokrotne wykonanie powyższej funkcji

    render();

    // button
    let box = document.getElementById("box")

    box.addEventListener("click", function () {
        console.log("click");
        if (cubeVisible == false) {
            // dodanie kostki
            const geometry = new THREE.BoxGeometry(150, 150, 150, 5, 5, 5);
            const material = new THREE.MeshBasicMaterial({
                color: 0x8888ff,
                side: THREE.DoubleSide,
                wireframe: true,
                transparent: true,
                opacity: 0.5
            });
            cube = new THREE.Mesh(geometry, material);

            // potrzebne do usunięcia
            cube.name = "cube"

            // dodaje obiekt
            scene.add(cube);

            // potrzebne do obrotu oraz robi z buttona switch on/off
            cubeVisible = true

            // zmiana zawartości
            this.innerHTML = "added"

        }
        else {
            let obj = scene.getObjectByName("cube")
            scene.remove(obj)
            cubeVisible = false

            // zmiana zawartości
            this.innerHTML = "cube"
        }

    })

    let sphere = document.getElementById("sphere")


    sphere.addEventListener("click", function () {
        console.log("click");
        if (sphereVisible == false) {
            // dodanie kostki
            const geometry = new THREE.SphereGeometry(80, 20, 20);
            const material = new THREE.MeshBasicMaterial({
                color: 0x0bfc03,
                side: THREE.DoubleSide,
                wireframe: true,
                transparent: true,
                opacity: 0.5
            });
            sphere = new THREE.Mesh(geometry, material);

            // potrzebne do usunięcia
            sphere.name = "sphere"
            sphereVisible = true

            // dodanie obiektu
            scene.add(sphere);

            // zmiana zawartości
            this.innerHTML = "added"

        }
        else {
            let obj = scene.getObjectByName("sphere")
            scene.remove(obj)
            sphereVisible = false

            // zmiana zawartości
            this.innerHTML = "sphere"
        }

    })

    let cylinder = document.getElementById("cylinder")

    cylinder.addEventListener("click", function () {
        console.log("click");
        if (cylinderVisible == false) {
            // dodanie kostki
            const geometry = new THREE.CylinderGeometry(75, 75, 150, 10, 10, 10);
            const material = new THREE.MeshBasicMaterial({
                color: 0xf21b1b,
                side: THREE.DoubleSide,
                wireframe: true,
                transparent: true,
                opacity: 0.5
            });
            cylinder = new THREE.Mesh(geometry, material);

            // potrzebne do usunięcia
            cylinder.name = "cylinder"

            scene.add(cylinder);

            cylinderVisible = true

            // zmiana zawartości
            this.innerHTML = "added"
        }
        else {
            let obj = scene.getObjectByName("cylinder")
            scene.remove(obj)
            cylinderVisible = false

            // zmiana zawartości
            this.innerHTML = "cylinder"
        }

    })

    let cone = document.getElementById("cone")

    cone.addEventListener("click", function () {
        console.log("click");
        if (coneVisible == false) {
            // dodanie kostki
            const geometry = new THREE.CylinderGeometry(0, 75, 155, 10, 10, 10);
            const material = new THREE.MeshBasicMaterial({
                color: 0xf21bf2,
                side: THREE.DoubleSide,
                wireframe: true,
                transparent: true,
                opacity: 0.5
            });
            cone = new THREE.Mesh(geometry, material);

            // potrzebne do usunięcia
            cone.name = "cone"

            scene.add(cone);

            coneVisible = true

            // zmiana zawartości
            this.innerHTML = "added"
        }
        else {
            let obj = scene.getObjectByName("cone")
            scene.remove(obj)
            coneVisible = false

            // zmiana zawartości
            this.innerHTML = "cone"
        }



    })

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

})

