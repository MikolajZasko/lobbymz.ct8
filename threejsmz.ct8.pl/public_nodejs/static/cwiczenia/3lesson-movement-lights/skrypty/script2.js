$(document).ready(function () {
    // scena 3D

    const scene = new THREE.Scene();

    const player = new Player(0, 0, 0)

    scene.add(player.getPlayerCont())

    // vectors for movement
    let clickedVect = new THREE.Vector3(0, 0, 0);
    let directionVect = new THREE.Vector3(0, 0, 0);

    // 
    let clicked = false

    // add floor
    const geometryFloor = new THREE.BoxGeometry(300, 0, 300, 10, 10, 10, 10);
    const materialFloor = new THREE.MeshBasicMaterial({
        color: 0xd9cf14,
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: false,
        opacity: 0.5,
        polygonOffset: true,
        polygonOffsetFactor: 1, // positive value pushes polygon further away
        polygonOffsetUnits: 1
    });

    const floor = new THREE.Mesh(geometryFloor, materialFloor);
    floor.position.set(0, -6, 0)
    floor.name = "floor"

    scene.add(floor);

    // wireframe
    let geo = new THREE.EdgesGeometry(floor.geometry);
    let mat = new THREE.LineBasicMaterial({ color: 0x000000 });
    let wireframe = new THREE.LineSegments(geo, mat);
    wireframe.name = "floor"
    floor.add(wireframe);

    let wireframe2 = new THREE.LineSegments(geo, mat);
    wireframe2.rotation.y = (90 * 0.0174532925)
    wireframe2.name = "floor"

    floor.add(wireframe2)

    // osie
    let axes = new THREE.AxesHelper(1000)
    scene.add(axes)

    axes = new THREE.AxesHelper(1000)
    axes.rotation.x = 1.57 * 2
    // axes.rotation.y = 1.57
    axes.rotation.z = 1.57 * 2
    scene.add(axes)

    const camera = new THREE.PerspectiveCamera(
        50,    // kąt patrzenia kamery (FOV - field of view)
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

    camera.position.set(0, 120, 120)

    // nakierowanie kamery na punkt (0,0,0) w przestrzeni (zakładamy, że istnieje już scena)

    camera.lookAt(scene.position);


    // raytracer
    const raycaster = new THREE.Raycaster()
    const mouseVector = new THREE.Vector2()

    window.addEventListener("mousedown", (e) => {
        clicked = true
    })

    window.addEventListener("mouseup", (e) => {
        clicked = false
    })


    // event do raytracer 
    window.addEventListener("mousemove", (e) => {
        if (clicked) {
            mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouseVector, camera);

            const intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0) {
                // zerowy w tablicy czyli najbliższy kamery obiekt to ten, którego potrzebujemy:

                if (intersects.length > 0) {
                    let hitObject = intersects[0].object
                    console.log(hitObject);
                    if (hitObject.name == "floor") {

                        // remove 1 sphere
                        let spheres = scene.getObjectByName("sphere")
                        scene.remove(spheres)

                        intersects[0].point.y = 0
                        clickedVect = intersects[0].point
                        console.log(clickedVect)

                        let angle = Math.atan2(
                            player.getPlayerCont().position.clone().x - clickedVect.x,
                            player.getPlayerCont().position.clone().z - clickedVect.z
                        )

                        player.getPlayerMesh().rotation.y = angle
                        player.getPlayerAxes().rotation.y = (angle + (1.57 * 2))

                        console.log(angle);

                        directionVect = clickedVect.clone().sub(player.getPlayerCont().position).normalize() // sub - > odejmij pozycję playera od pozycji kliknięcia
                        console.log(directionVect)

                        // add a sphere
                        let sphere = new Sphere(clickedVect.x, clickedVect.y, clickedVect.z)

                        sphere = sphere.getSphere()
                        sphere.name = "sphere"

                        scene.add(sphere)

                        //użyta wyżej funkcja normalize() przelicza proporcjonalnie współrzędne x,y,z wektora na zakres 0-1
                        //jest to wymagane przez kolejne funkcje  
                    }

                }

            }
        }

    })


    // kluczowy element - animacja

    function render() {

        camera.position.x = player.getPlayerCont().position.x
        camera.position.z = player.getPlayerCont().position.z + 100
        camera.position.y = player.getPlayerCont().position.y + 100
        camera.lookAt(player.getPlayerCont().position)

        // distance
        let dist = player.getPlayerCont().position.clone().distanceTo(clickedVect)

        if (Math.round(dist) != 0) {
            player.getPlayerCont().translateOnAxis(directionVect, 1) // 5 - przewidywany speed czyli względna szybkość ruchu po planszy

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

