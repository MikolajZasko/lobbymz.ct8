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

    // dodanie kostki
    const geometry = new THREE.BoxGeometry(100, 30, 30);
    const material = new THREE.MeshBasicMaterial({
        color: 0x03fcf4,
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: true,
        opacity: 0.5
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // kluczowy element - animacja

    // checkbox 
    let spin = $("#spin")

    // checkbox ma być odznaczony na począdku
    if (spin.is(':checked')) {
        spin.prop("checked", false)
    }

    function render() {
        // obrót kostki gdy ckeckbox jest checked
        if (spin.is(':checked')) {
            cube.rotation.y += 0.01;
        }


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

    // button
    let cameraButton = $("#camera")

    // pozycje kamery
    let cameraPosList = [
        { x: 100, y: 100, z: 100 },
        { x: 0, y: 0, z: 100 },
        { x: 100, y: 0, z: 0 },
        { x: 0, y: 100, z: 0 }
    ]

    // licznik
    let counter = 1

    cameraButton.on("click", function () {
        // zmiana pozycji kamery
        camera.position.set(cameraPosList[counter].x, cameraPosList[counter].y, cameraPosList[counter].z)

        // patrzymy na punkt (0, 0 ,0)
        camera.lookAt(scene.position)

        // dodajemy do licznika
        counter++

        // jeśli licznik na końcu, resetujemy liste
        if (counter == cameraPosList.length) {
            counter = 0
        }
    })

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

})
