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

    camera.position.set(30, 30, 30)

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

        //ciągłe renderowanie / wyświetlanie widoku sceny naszą kamerą

        renderer.render(scene, camera);
    }

    // na koniec jednokrotne wykonanie powyższej funkcji

    render();

    // stworzenie siatki
    // 
    // począdkowe wartości
    let x = -22
    let z = -22

    for (let i = 0; i < 25; i++) {

        console.log("1");

        // dodanie kostki
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshNormalMaterial({
            color: 0x03fcf4,
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            opacity: 1
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // zmiana pozycji
        cube.position.x = x
        cube.position.z = z

        // ustalenie pozycji
        x += 11

        // jeśli zrobi 5 kostek, dodaje do z i zmienia x na począdkową wartość
        if (x > 22) {
            x = -22
            z += 11
        }


    }

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

})
