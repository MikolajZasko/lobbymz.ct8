
$(document).ready(function () {
    // scena 3D

    const scene = new THREE.Scene();

    // add floor

    let texture = new THREE.TextureLoader().load("../mats/3.jpg")
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);

    let geometry = new THREE.PlaneGeometry(1000, 1000);
    let material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        map: texture

    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = 1.57
    scene.add(plane);

    texture = new THREE.TextureLoader().load("../mats/test.jpg")

    texture.colorSpace = THREE.SRGBColorSpace;

    // add a box
    geometry = new THREE.BoxGeometry(30, 30, 30, 2, 2, 2);
    material = new THREE.MeshPhongMaterial({
        specular: 0xffffff,
        shininess: 50,
        side: THREE.DoubleSide,
        map: texture
    })
    let box = new THREE.Mesh(geometry, material); // box sześcian

    box.name = "box"

    box.position.set(0, 15, 0)

    scene.add(box)

    // osie
    let axes = new THREE.AxesHelper(1000)
    scene.add(axes)

    axes = new THREE.AxesHelper(1000)
    axes.rotation.x = 1.57 * 2
    // axes.rotation.y = 1.57
    axes.rotation.z = 1.57 * 2
    scene.add(axes)

    // add a light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    // user light change
    let range = $("#intensity")

    range.on("input", function () {
        light.intensity = range.val()
    })

    // user change posision of light
    let button = $("#button")
    let description = $("#description")

    let positionCounter = 0

    button.on("click", function () {
        console.log("changed");
        if (positionCounter == 0) {
            light.position.set(0, 1, 0);
            description.html("x=0,y=1,z=0")
            positionCounter += 1
        }
        else if (positionCounter == 1) {
            light.position.set(0, 0, 0);
            description.html("x=0,y=0,z=0")
            positionCounter += 1
        }
        else if (positionCounter == 2) {
            light.position.set(10, 1, 0);
            description.html("x=10,y=1,z=0")
            positionCounter += 1
        }
        else if (positionCounter == 3) {
            positionCounter += 1
            light.position.set(10, 1, -10);
            description.html("x=10,y=1,z=-10")
        }
        else {
            positionCounter = 0
            light.position.set(1, 1, 1);
            description.html("x=1,y=1,z=1")
        }
    })


    const camera = new THREE.PerspectiveCamera(
        90,    // kąt patrzenia kamery (FOV - field of view)
        window.innerWidth / window.innerHeight,    // proporcje widoku, powinny odpowiadać proporcjom ekranu przeglądarki użytkownika
        0.1,    // minimalna renderowana odległość
        10000    // maksymalna renderowana odległość od kamery
    );

    // renderer wykorzystujący WebGL - działa stabilnie na wszystkich
    // najnowszych przeglądarkach zarówno desktopowych jak mobilnych

    const renderer = new THREE.WebGLRenderer();

    renderer.useLegacyLights = true

    // kolor tła sceny - uwaga na prefix 0x a nie #

    renderer.setClearColor(0xffffff);

    // ustal rozmiary renderowanego okna w px (szer, wys)

    renderer.setSize(window.innerWidth, window.innerHeight);

    // dodanie renderera do diva, który istnieje na scenie

    document.getElementById("root").appendChild(renderer.domElement);

    camera.position.set(80, 80, 80)

    // nakierowanie kamery na punkt (0,0,0) w przestrzeni (zakładamy, że istnieje już scena)

    camera.lookAt(scene.position);


    // raytracer
    const raycaster = new THREE.Raycaster()
    const mouseVector = new THREE.Vector2()

    window.addEventListener("mousedown", (e) => {
        mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouseVector, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            // zerowy w tablicy czyli najbliższy kamery obiekt to ten, którego potrzebujemy:

            // console.log(intersects[0].object.parent.position);

            let hitObject = intersects[0].object.parent.children[0]

        }

    })

    window.addEventListener("mouseup", (e) => {

    })

    // kluczowy element - animacja

    function render() {



        //w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
        //np zmieniająca się wartość rotacji obiektu

        //wykonywanie funkcji bez końca, ok 10 fps jeśli pozwala na to wydajność maszyny

        requestAnimationFrame(render);

        // potwierdzenie w konsoli, że render się wykonuje

        // console.log("render leci")

        //ciągłe renderowanie / wyświetlanie widoku sceny naszą kamerą

        renderer.render(scene, camera);
    }

    // na koniec jednokrotne wykonanie powyższej funkcji

    render();

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }


})

