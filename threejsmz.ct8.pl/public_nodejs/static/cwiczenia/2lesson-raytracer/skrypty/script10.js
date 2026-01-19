$(document).ready(function rysowanko() {
    // scena 3D

    const scene = new THREE.Scene();

    // osie
    const axes = new THREE.AxesHelper(1000)
    scene.add(axes)

    // zmienna fov
    let fov = $("#fov").val()

    // deklaracja yHeight 
    let yHeight

    // lista nazw
    let nameList = []

    // 
    let countRange = $("#count").val() - 1

    // 
    let yInput = false

    const camera = new THREE.PerspectiveCamera(
        fov,    // kąt patrzenia kamery (FOV - field of view)
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

    camera.position.set(0, 100, 100)

    // nakierowanie kamery na punkt (0,0,0) w przestrzeni (zakładamy, że istnieje już scena)

    camera.lookAt(scene.position);

    // kluczowy element - animacja

    function render() {

        // zmiana fov kamery
        fov = $("#fov").val()

        camera.up

        camera.fov = fov
        camera.updateProjectionMatrix();

        //w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
        //np zmieniająca się wartość rotacji obiektu

        //wykonywanie funkcji bez końca, ok 60 fps jeśli pozwala na to wydajność maszyny

        requestAnimationFrame(render);

        // potwierdzenie w konsoli, że render się wykonuje

        console.log("render leci")

        //ciągłe renderowanie / wyświetlanie widoku sceny naszą kamerą

        renderer.render(scene, camera);
    }

    // na koniec jednokrotne wykonanie powyższej funkcji

    render();

    function siatkaRender() {
        // stworzenie siatki
        // 
        // począdkowe wartości

        countRange = $("#count").val() - 1

        let x
        if (countRange % 2 == 0) {
            x = (countRange) / 2 * 10
        }
        else {
            x = (countRange - 1) / 2 * 10

        }

        let y = 0
        let z = -(countRange * 10 / 2)
        yHeight = $("#yHeight").val()

        for (let i = 0; i < countRange * 4; i++) {
            // rysowanie 1 schodów
            if (i < countRange) {
                // dodanie kostki
                const geometry = new THREE.BoxGeometry(10, 10, 10);
                const material = new THREE.MeshNormalMaterial({
                    // color: 0x03fcf4,
                    side: THREE.DoubleSide,
                    wireframe: false,
                    transparent: true,
                    opacity: 1
                });
                const cube = new THREE.Mesh(geometry, material);

                // nadanie nazw
                cube.name = `box${i}`
                nameList.push(`box${i}`)

                scene.add(cube);

                // pozycjonowanie
                cube.position.z = z
                cube.position.y = y
                cube.position.x = x

                // przygotowanie pozycji pod next box
                x -= 10
                y += 10
            }
            // rysowanie 2 schodów
            else if (i < countRange * 2) {
                // dodanie kostki
                const geometry = new THREE.BoxGeometry(10, 10, 10);
                const material = new THREE.MeshNormalMaterial({
                    // color: 0x03fcf4,
                    side: THREE.DoubleSide,
                    wireframe: false,
                    transparent: true,
                    opacity: 1
                });
                const cube = new THREE.Mesh(geometry, material);

                // nadanie nazw
                cube.name = `box${i}`
                nameList.push(`box${i}`)

                scene.add(cube);

                // pozycjonowanie
                cube.position.z = z
                cube.position.y = y
                cube.position.x = x

                // przygotowanie pozycji pod next box
                z += 10
                y -= 10
            }
            // rysowanie 3 schodów
            else if (i < countRange * 3) {
                // dodanie kostki
                const geometry = new THREE.BoxGeometry(10, 10, 10);
                const material = new THREE.MeshNormalMaterial({
                    // color: 0x03fcf4,
                    side: THREE.DoubleSide,
                    wireframe: false,
                    transparent: true,
                    opacity: 1
                });
                const cube = new THREE.Mesh(geometry, material);

                // nadanie nazw
                cube.name = `box${i}`
                nameList.push(`box${i}`)

                scene.add(cube);

                // pozycjonowanie
                cube.position.z = z
                cube.position.y = y
                cube.position.x = x

                // przygotowanie pozycji pod next box
                x += 10
                y += 10
            }
            // rysowanie 4 schodów
            else if (i < countRange * 4) {
                // dodanie kostki
                const geometry = new THREE.BoxGeometry(10, 10, 10);
                const material = new THREE.MeshNormalMaterial({
                    // color: 0x03fcf4,
                    side: THREE.DoubleSide,
                    wireframe: false,
                    transparent: true,
                    opacity: 1
                });
                const cube = new THREE.Mesh(geometry, material);

                // nadanie nazw
                cube.name = `box${i}`
                nameList.push(`box${i}`)

                scene.add(cube);

                // pozycjonowanie
                cube.position.z = z
                cube.position.y = y
                cube.position.x = x

                // przygotowanie pozycji pod next box
                z -= 10
                y -= 10
            }
        }
    }

    // wywołanie funkcji raz, przy załadowaniu
    siatkaRender()


    $("#y").on("input", function () {
        // zmiana pozycji yHeight 
        yHeight = $("#y").val()

        for (let i = 0; i < nameList.length; i++) {
            // element do podniesienia
            let boxUp = scene.getObjectByName(nameList[i])

            // obliczenie co to za schodek
            let id = parseInt(String(nameList[i]).slice(3))

            // zmiana dla 1 schodów
            if (id <= countRange) {
                boxUp.position.y = id * 10 + parseInt(yHeight)
            }

            // zmiana dla 2 schodów
            else if (id < countRange * 2) {
                boxUp.position.y = (countRange - (id % countRange)) * 10 + parseInt(yHeight)
            }

            // zmiana dla 3 schodów
            else if (id < countRange * 3) {
                boxUp.position.y = (id % countRange) * 10 + parseInt(yHeight)
            }

            // zmiana dla 4 schodów
            else if (id < countRange * 4) {
                boxUp.position.y = (countRange - (id % countRange)) * 10 + parseInt(yHeight)
            }
        }
    })

    $("#count").on("input", function () {
        // usuwanie kostek
        while (scene.children.length > 1) {
            scene.remove(scene.children[1])
        }
        // generowanie kostek na nowo
        siatkaRender()

        // reset suwaka wysokości
        $("#y").val(0)
    })

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }
})
