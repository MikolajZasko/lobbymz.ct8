// window.addEventListener("load", function(){
// })

$(document).ready(function () {

    console.log(window.innerWidth);

    // scena 3D

    const scene = new THREE.Scene();

    const axes = new THREE.AxesHelper(1000)
    scene.add(axes)

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

    camera.position.set(100, 100, 100)

    // nakierowanie kamery na punkt (0,0,0) w przestrzeni (zakładamy, że istnieje już scena)

    camera.lookAt(scene.position);

    // kluczowy element - animacja

    function render() {


        //w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
        //np zmieniająca się wartość rotacji obiektu

        //mesh.rotation.y += 0.01;

        //wykonywanie funkcji bez końca, ok 60 fps jeśli pozwala na to wydajność maszyny

        requestAnimationFrame(render);

        // potwierdzenie w konsoli, że render się wykonuje

        console.log("render leci")

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