$(document).ready(function () {
    // movement variables
    let spherePresent = false
    let started = true
    let counter = 0

    // scena 3D

    const scene = new THREE.Scene();

    // cube
    let cube = new Cube(0, 0, 0)
    cube = cube.getCube()

    // axes
    let axes = new THREE.AxesHelper(20)
    scene.add(axes)

    // object / container
    let obj = new Container()

    obj = obj.getContainer()

    obj.add(cube)
    obj.add(axes)

    scene.add(obj);

    // add floor
    const geometryFloor = new THREE.BoxGeometry(100, 0, 100, 10, 10, 10, 10);
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
    axes = new THREE.AxesHelper(50)
    axes.position.y = -6
    scene.add(axes)

    axes = new THREE.AxesHelper(50)
    axes.position.y = -6
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

    camera.position.set(-70, 70, 70)

    // nakierowanie kamery na punkt (0,0,0) w przestrzeni (zakładamy, że istnieje już scena)

    camera.lookAt(scene.position);


    // raytracer
    const raycaster = new THREE.Raycaster()
    const mouseVector = new THREE.Vector2()

    // event do raytracer
    window.addEventListener("mousedown", (e) => {
        console.log(e);
        mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouseVector, camera);

        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            // zerowy w tablicy czyli najbliższy kamery obiekt to ten, którego potrzebujemy:
            let hitObject = intersects[0].object
            console.log(intersects[0].object.name);
            // koordynaty kliku w 3D
            coords = intersects[0].point
            if (hitObject.name == "floor" && !(spherePresent)) {
                let sphere = new Sphere(coords.x, coords.y, coords.z)

                scene.add(sphere.getSphere());

                spherePresent = true
            }
        }
    });


    // kluczowy element - animacja

    function render() {

        let obj = scene.getObjectByName("obj")

        obj.rotation.equals(3)
        if (spherePresent) {
            // current cube x and y
            let cube = scene.getObjectByName("cube")

            x = cube.position.x
            y = cube.position.y
            if (started) {

                // saved to object
                startCoords = { "x": x, "y": y }

                let sphere = scene.getObjectByName("sphere")

                // coords that we want to reach
                endCoords = { "x": sphere.position.x, "y": sphere.position.y }

                // amgle based on atan2 function
                let angle = (Math.atan2(endCoords.y - startCoords.y, endCoords.x - startCoords.x) * 57.3)

                cube.rotation.x += 33

                console.log(cube.rotation);

                rakieta.css("transform", `rotate(${Math.floor(angle + 90)}deg)`)

                // set the process as started but not finished
                started = false

                // count the vector
                // 
                // a,b,c - triangle sides, from Pythagorean theorem we count c - distance between points
                let a = endCoords.y - startCoords.y
                let b = endCoords.x - startCoords.x

                c = Math.sqrt(a * a + b * b)

                vect = {
                    "x": (b + 6) / Math.floor(c) * 5,
                    "y": (a + 6) / Math.floor(c) * 5
                }

            }
            else {
                // move the box in vector's direction
                cube.position.x = x + parseFloat(vect.x)
                cube.position.y = y + parseFloat(vect.y)

                // add 1 to counter
                counter += 1

                // finish the process if counter reaches a given number (vector)
                if (counter == Math.floor(c / 5)) {
                    counter = 0
                    finished = true

                    // // sprawdza czy checkbox 'kierunek lotu' jest zaznaczony
                    // if (checkbox[0].checked) {
                    //     // jeśli tak to odwraca kierunek lotu
                    //     // czyli leci liczbami malejąco
                    //     if (stepsCounter == 0) {
                    //         stepsCounter = coords.length - 1
                    //     }
                    //     else {
                    //         stepsCounter -= 1
                    //     }
                    // }
                    // else {
                    //     // jeśli nie to leci liczbami rosnąco
                    //     if (stepsCounter == coords.length - 1) {
                    //         stepsCounter = 0
                    //     }
                    //     else {
                    //         stepsCounter += 1
                    //     }
                    // }


                }

            }
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

