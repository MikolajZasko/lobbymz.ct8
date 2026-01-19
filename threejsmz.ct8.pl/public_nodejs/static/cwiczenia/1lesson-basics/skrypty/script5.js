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

    // zmienne buttonów
    let create = $("#create")

    // kolory
    let randomColorList = [0x4287f5, 0xf5424e, 0x42daf5, 0xf2f542, 0xf5b642, 0x42f54b, 0xd442f5]
    let colorCounter = 0
    let rectCounter = 0

    create.on("click", function () {

        // zmienne inputów
        let width = $("#width").val()
        let height = $("#height").val()
        let depth = $("#depth").val()

        // dodanie kostki
        const geometry = new THREE.BoxGeometry(parseInt(width), parseInt(height), parseInt(depth));
        const material = new THREE.MeshBasicMaterial({
            color: randomColorList[colorCounter],
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            opacity: 0.5
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // potrzebne do kolorów
        colorCounter++

        if (colorCounter == randomColorList.length) {
            colorCounter = 0
        }

        // potrzebne do liczenia box'ów
        rectCounter++

        // dodanie textu/info o dodanej kostce 
        let pre = document.getElementById("pre")
        pre.innerHTML += `box${rectCounter} - width: ${width} height: ${height} depth: ${depth} \n`
    })

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }
})
