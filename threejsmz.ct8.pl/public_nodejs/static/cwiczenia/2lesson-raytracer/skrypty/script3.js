$(document).ready(function rysowanko() {
    let rotate
    let button = $("#button")
    let cameraMove = false
    let pre = $("#pre")

    pre.html("{ \n camPosX:200 \n camPosZ:200 \n}")

    // scena 3D

    const scene = new THREE.Scene();

    // osie
    const axes = new THREE.AxesHelper(1000)
    scene.add(axes)

    // dodanie kostki
    const geometry = new THREE.BoxGeometry(50, 50, 50);

    const texture = new THREE.TextureLoader().load('../mats/1.jpg')
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        map: texture,
        transparent: true, // przezroczysty / nie
        opacity: 0.8, // stopień przezroczystości
    })

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const camera = new THREE.PerspectiveCamera(
        45,    // kąt patrzenia kamery (FOV - field of view)
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

    camera.position.set(200, 0, 200)

    // nakierowanie kamery na punkt (0,0,0) w przestrzeni (zakładamy, że istnieje już scena)

    camera.lookAt(scene.position);

    // kluczowy element - animacja

    function render() {


        //w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
        //np zmieniająca się wartość rotacji obiektu

        // box rotate
        rotate = cube.rotation.y += 0.01;
        rotate = Math.round(rotate * 57.2958)

        if (rotate >= 360) {
            console.log("zerowanie");
            cube.rotation.y = 0
        }

        if (cameraMove) {
            camera.position.x = camera.position.x - 0.5
            camera.position.z = camera.position.z - 0.5
            camera.lookAt(0, 0, 0)
            pre.html(`{ \n camPosX:${camera.position.x} \n camPosZ:${camera.position.z} \n}`)
        }

        //wykonywanie funkcji bez końca, ok 60 fps jeśli pozwala na to wydajność maszyny

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

    // button operation
    button.on("click", function () {
        if (cameraMove) {
            cameraMove = false
        }
        else {
            cameraMove = true
        }
    })
})

