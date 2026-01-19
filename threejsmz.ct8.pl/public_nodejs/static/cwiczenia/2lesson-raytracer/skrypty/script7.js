$(document).ready(function rysowanko() {
    let rotate
    let button = $("#button")
    let cameraMove = false
    let pre = $("#pre")
    let angle = 0

    let spinningCubes = []

    pre.html("{ \n camPosX:150 \n camPosY:100 \n camPosZ:150 \n}")

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
    const axes = new THREE.AxesHelper(1000)
    scene.add(axes)

    // dodanie kostki
    const geometry = new THREE.BoxGeometry(50, 50, 50);

    let cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
    cube.position.set(0, 60, 0)

    cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
    cube.position.set(0, -60, 0)

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
            console.log(hitObject);
            console.log("trafiony!");
            if (spinningCubes.indexOf(hitObject) != -1) {
                console.log("już jest!!!");
                let index = spinningCubes.indexOf(hitObject)
                spinningCubes.splice(index, 1)
            }
            else {
                console.log("nowy... więc dodam");
                spinningCubes.push(hitObject)
            }
        }
    });

    // kluczowy element - animacja

    function render() {


        //w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
        //np zmieniająca się wartość rotacji obiektu

        if (cameraMove) {
            camera.position.z = 200 * Math.cos(angle);
            camera.position.x = 200 * Math.sin(angle);
            angle += 0.1
            camera.lookAt(scene.position)
            pre.html(`{ \n camPosX:${camera.position.x} \n camPosY:${camera.position.y} \n camPosZ:${camera.position.z} \n}`)
        }

        for (let i = 0; i < spinningCubes.length; i++) {
            rotate = spinningCubes[i].rotation.y += 0.01;
            rotate = Math.round(rotate * 57.2958)
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



