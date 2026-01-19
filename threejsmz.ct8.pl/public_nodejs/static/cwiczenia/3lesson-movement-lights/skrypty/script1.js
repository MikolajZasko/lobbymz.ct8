$(document).ready(function () {
    angle = 44.7

    // scena 3D

    const scene = new THREE.Scene();

    let obj = new Container()

    obj = obj.getContainer()

    cube = new Cube(0, 0, 0)

    obj.add(cube.getCube());

    cube = new Cube(20, 0, 0)

    obj.add(cube.getCube());

    cube = new Cube(0, 0, -20)

    obj.add(cube.getCube());

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

    scene.add(floor);

    // wireframe
    let geo = new THREE.EdgesGeometry(floor.geometry);
    let mat = new THREE.LineBasicMaterial({ color: 0x000000 });
    let wireframe = new THREE.LineSegments(geo, mat);
    floor.add(wireframe);

    let wireframe2 = new THREE.LineSegments(geo, mat);
    wireframe2.rotation.y = (90 * 0.0174532925)

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

    camera.position.set(0, 70, 70)

    // nakierowanie kamery na punkt (0,0,0) w przestrzeni (zakładamy, że istnieje już scena)

    camera.lookAt(scene.position);

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

    // change on input
    $(".onInput").on('input', function () {
        let cubeX = $("#cubeX").val()
        let objectY = $("#objectY").val()

        // change cube position
        let cube = scene.getObjectByName("cube")
        cube.position.x = cubeX

        // change object position
        let object = scene.getObjectByName("obj")
        object.position.y = objectY
    })


})

