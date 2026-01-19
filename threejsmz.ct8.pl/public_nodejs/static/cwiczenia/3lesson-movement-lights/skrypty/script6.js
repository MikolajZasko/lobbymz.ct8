
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
    let obj = new THREE.Object3D()

    const light = new THREE.SpotLight(0xffffff, 1, 500, Math.PI / 8);
    light.position.set(0, 100, 0);
    light.target = scene;

    geometry = new THREE.BoxGeometry(10, 10, 10, 2, 2, 2);
    material = new THREE.MeshBasicMaterial({
        color: 0x184cdb,
        specular: 0x184cdb,
        wireframe: true,
        shininess: 50,
        side: THREE.DoubleSide,
    })

    box = new THREE.Mesh(geometry, material); // box sześcian

    box.name = "lightBox"

    box.position.set(0, 100, 0)

    obj.add(light);
    obj.add(box)

    scene.add(obj)

    // user light change
    let intensity = $("#intensity")
    let dIntensity = $("#dIntensity")

    intensity.on("input", function () {
        light.intensity = intensity.val()
        dIntensity.html(`intensity = ${intensity.val()}`)
    })

    // user change posision of light
    let yPos = $("#yPos")
    let lightBox = scene.getObjectByName("lightBox")
    let dPosition = $("#dPosition")

    yPos.on("input", function () {
        light.position.y = yPos.val()
        lightBox.position.y = yPos.val()
        dPosition.html(`light position = ${yPos.val()}`)
    })

    // add target
    geometry = new THREE.SphereGeometry(10, 10, 10);
    material = new THREE.MeshBasicMaterial({
        color: 0xebe534,
        side: THREE.DoubleSide,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    let target = new THREE.Mesh(geometry, material);

    target.position.set(100, 8, 0)

    target.name = "target"

    scene.add(target)

    // user target rotation
    let targetRotation = $("#targetRotation")
    let pre = document.getElementById("pre")

    targetRotation.on("input", function () {
        let angle = targetRotation.val()

        let x = Math.cos(angle / 57.3) * 100
        let z = Math.sin(angle / 57.3) * 100

        target.position.set(x, 8, z)

        pre.innerHTML = `    x = ${Math.round(x)}
    y = 8
    z = ${Math.round(z)}
        `
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


        // user change light target
        let sceneChecked = document.getElementById("scene").checked
        // let targetChecked = document.getElementById("target").checked



        if (sceneChecked) {
            light.target = scene
        }
        else {
            light.target = target
        }



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

