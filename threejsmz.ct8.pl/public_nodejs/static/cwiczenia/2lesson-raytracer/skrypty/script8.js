$(document).ready(function rysowanko() {
    let spinningCubes = []
    let pressedKey
    let selectedObj = undefined
    let mode = "sceneMovement"
    let coordList = []
    let selectedObjCoords
    angle = 44.7

    // materiały

    let materials = []

    const texture1 = new THREE.TextureLoader().load('../mats/upjpg.jpg')
    const texture2 = new THREE.TextureLoader().load('../mats/side.jpg')
    const texture3 = new THREE.TextureLoader().load('../mats/botjpg.jpg')

    texture1.colorSpace = THREE.SRGBColorSpace;
    texture2.colorSpace = THREE.SRGBColorSpace;
    texture3.colorSpace = THREE.SRGBColorSpace;


    materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture2, transparent: false, opacity: 1 }));
    materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture2, transparent: false, opacity: 1 }));
    materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture1, transparent: false, opacity: 1 }));
    materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture3, transparent: false, opacity: 1 }));
    materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture2, transparent: false, opacity: 1 }));
    materials.push(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture2, transparent: false, opacity: 1 }));
    // kolejność --> side side top bot side side


    // scena 3D

    const scene = new THREE.Scene();

    // osie
    let axes = new THREE.AxesHelper(1000)
    scene.add(axes)

    axes = new THREE.AxesHelper(1000)
    axes.rotation.x = 1.57 * 2
    // axes.rotation.y = 1.57
    axes.rotation.z = 1.57 * 2
    scene.add(axes)



    // stworzenie sześcianu mocy
    // 
    // począdkowe wartości
    let x = -22
    let z = -22
    let y = -22

    for (let i = 0; i < 125; i++) {

        // dodanie kostki
        const geometry = new THREE.BoxGeometry(20, 20, 20);
        const cube = new THREE.Mesh(geometry, materials);

        // cube.name = `box${i}`
        // nameList.push(`box${i}`)

        scene.add(cube);

        // zmiana pozycji
        cube.position.x = x * 2
        cube.position.z = z * 2
        cube.position.y = y * 2

        // ustalenie pozycji
        x += 11

        // jeśli zrobi 5 kostek, dodaje do z i zmienia x na począdkową wartość
        if (x > 22) {
            x = -22
            z += 11
        }
        // jeśli zrobi 25 kostek, dodaje do y i zmienia x oraz z  na począdkową wartość
        if (z > 22) {
            x = -22
            z = -22
            y += 11
        }

        // dodanie pozycji do listy
        coordList.push([cube.position.x, cube.position.y, cube.position.z])

    }

    console.log(coordList);

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

    camera.position.set(150, 100, 150)

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

            if (selectedObj) {
                console.log("obiekt został już wybrany");
            }
            else {
                console.log("zaznaczono obiekt");
                spinningCubes.push(hitObject)
                selectedObj = hitObject
                mode = "objectMovement"
                selectedObjCoords = [selectedObj.position.x, selectedObj.position.y, selectedObj.position.z]

                // deletes the selected cube coords form all coords
                coordList.splice(myIndexOf(coordList, selectedObjCoords), 1)
                console.log(myIndexOf(coordList, selectedObjCoords));
            }
        }
    });

    // kluczowy element - animacja

    function render() {


        //w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
        //np zmieniająca się wartość rotacji obiektu

        if (mode == "sceneMovement") {
            if (pressedKey == 38) {
                camera.position.y += 2
                camera.lookAt(scene.position);
            }
            else if (pressedKey == 40) {
                camera.position.y -= 2
                camera.lookAt(scene.position);
            }
            else if (pressedKey == 39) {
                camera.position.z = 200 * Math.cos(angle);
                camera.position.x = 200 * Math.sin(angle);
                angle += 0.05
                camera.lookAt(scene.position);
            }
            else if (pressedKey == 37) {
                camera.position.z = 200 * Math.cos(angle);
                camera.position.x = 200 * Math.sin(angle);
                angle -= 0.05
                camera.lookAt(scene.position);
            }
        }
        else if (mode == "objectMovement") {

            if (pressedKey == 27) {
                selectedObjCoords = [selectedObj.position.x, selectedObj.position.y, selectedObj.position.z]
                coordList.push(selectedObjCoords)

                selectedObj = undefined
                console.log("obiekt odznaczony, przechodze w tryb poruszania się kamerą");
                console.log(coordList); // TU COŚ UBYWA / COŚ TRZEBA DODAĆ
                mode = "sceneMovement"
            }
        }



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

    // key catching

    let keypress = true

    document.addEventListener("keydown", function (e) {
        pressedKey = e.keyCode
        console.log(pressedKey);
        if (keypress) {
            console.log(coordList);
            if (mode == "objectMovement") {
                firstCoords = [selectedObj.position.x, selectedObj.position.y, selectedObj.position.z]
                if (pressedKey == 38) {
                    selectedObj.position.y += 22
                    selectedObjCoords = [selectedObj.position.x, selectedObj.position.y, selectedObj.position.z]
                    while (myIncludes(coordList, selectedObjCoords)) {
                        selectedObj.position.y += 22
                        selectedObjCoords = [selectedObj.position.x, selectedObj.position.y, selectedObj.position.z]
                    }
                    coordList.push(selectedObjCoords)
                }
                else if (pressedKey == 40) {
                    selectedObj.position.y -= 22
                    selectedObjCoords = [selectedObj.position.x, selectedObj.position.y, selectedObj.position.z]
                    while (myIncludes(coordList, selectedObjCoords)) {
                        selectedObj.position.y -= 22
                        selectedObjCoords = [selectedObj.position.x, selectedObj.position.y, selectedObj.position.z]
                    }
                    coordList.push(selectedObjCoords)
                }
                else if (pressedKey == 39) {
                    selectedObj.position.x += 22
                    selectedObjCoords = [selectedObj.position.x, selectedObj.position.y, selectedObj.position.z]
                    while (myIncludes(coordList, selectedObjCoords)) {
                        selectedObj.position.x += 22
                        selectedObjCoords = [selectedObj.position.x, selectedObj.position.y, selectedObj.position.z]
                    }
                    coordList.push(selectedObjCoords)
                }
                else if (pressedKey == 37) {
                    selectedObj.position.x -= 22
                    selectedObjCoords = [selectedObj.position.x, selectedObj.position.y, selectedObj.position.z]
                    while (myIncludes(coordList, selectedObjCoords)) {
                        selectedObj.position.x -= 22
                        selectedObjCoords = [selectedObj.position.x, selectedObj.position.y, selectedObj.position.z]
                    }
                    coordList.push(selectedObjCoords)
                }
                else if (pressedKey == 90) {
                    selectedObj.position.z += 22
                    selectedObjCoords = [selectedObj.position.x, selectedObj.position.y, selectedObj.position.z]
                    while (myIncludes(coordList, selectedObjCoords)) {
                        selectedObj.position.z += 22
                        selectedObjCoords = [selectedObj.position.x, selectedObj.position.y, selectedObj.position.z]
                    }
                    coordList.push(selectedObjCoords)
                }
                else if (pressedKey == 88) {
                    selectedObj.position.z -= 22
                    selectedObjCoords = [selectedObj.position.x, selectedObj.position.y, selectedObj.position.z]
                    while (myIncludes(coordList, selectedObjCoords)) {
                        selectedObj.position.z -= 22
                        selectedObjCoords = [selectedObj.position.x, selectedObj.position.y, selectedObj.position.z]
                    }
                    coordList.push(selectedObjCoords)
                }
                if (pressedKey != 27) {
                    coordList.pop()
                }
            }

            keypress = false
        }

    })

    document.addEventListener("keyup", function (e) {
        pressedKey = ""
        console.log(pressedKey);
        keypress = true
    })

    function myIncludes(arr, coords) {
        let n = arr.length
        for (let i = 0; i < n; i++) {
            if (JSON.stringify(arr[i]) === JSON.stringify(coords)) {
                return true
            }

        }
    }

    function myIndexOf(arr, coords) {
        let n = arr.length
        for (let i = 0; i < n; i++) {
            if (JSON.stringify(arr[i]) === JSON.stringify(coords)) {
                return i
            }

        }
    }
})



