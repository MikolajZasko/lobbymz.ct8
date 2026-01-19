$(document).ready(function rysowanko() {

    let boxAdded

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

    camera.position.set(180, 180, 180)

    // nakierowanie kamery na punkt (0,0,0) w przestrzeni (zakładamy, że istnieje już scena)

    camera.lookAt(scene.position);

    // kluczowy element - animacja

    // zmienna
    let counter = 0

    function render() {

        // spiiiiiiin
        for (let i = 0; i < counter; i++) {
            let boxToSpin = scene.getObjectByName(`box${i}`)

            boxToSpin.rotation.y += 0.01;
            boxToSpin.rotation.x += 0.01;
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

    // zmienne
    let add = document.getElementById("add")
    let boxList = []

    add.addEventListener("click", function () {
        // generuje losową liczbę w systemie 16, jeśli liczba ma mniej niż 6 znaków, próbuje ponownie
        // robimy tak ponieważ gdy liczba ma np 5 znaków, dla przeglądarki nie odpowiada za żaden kolor
        let randomColorList = [0x4287f5, 0xf5424e, 0x42daf5, 0xf2f542, 0xf5b642, 0x42f54b, 0xd442f5]

        let randomColor = randomColorList[Math.floor(Math.random() * randomColorList.length)]


        // dodanie kostki
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshBasicMaterial({
            color: randomColor,
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            opacity: 0.5
        });
        const box = new THREE.Mesh(geometry, material);

        // nadanie nazwy kostce
        box.name = `box${counter}`

        // dodanie obiektu
        scene.add(box);

        // losowanie koordynatów
        let x = (Math.round(Math.random() * 200))
        let y = (Math.round(Math.random() * 200))
        let z = (Math.round(Math.random() * 200))

        // ustawienie kostki w wylosowanych 
        box.position.set(x, y, z)

        // dodanie textu/info o dodanej kostce 
        let pre = document.getElementById("pre")
        pre.innerHTML += `box${counter} - x: ${x} y: ${y} z: ${z} \n`

        // odpowiada za liczenie aktualnej ilości kostek i nadania nazw
        counter++

        // dodanie koordynatów i nazwy do listy
        boxList.push({ name: `box${counter}`, x: x, y: y, z: z })
    })

    let del = document.getElementById("del")

    del.addEventListener("click", function () {
        // usuwa każdą kostkę
        for (let i = 0; i <= counter; i++) {
            let boxToDel = scene.getObjectByName(`box${i}`)

            scene.remove(boxToDel)
        }
        // zeruje counter
        counter = 0

        // czyści zawartość info box
        document.getElementById("pre").innerHTML = ""
    })

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

})
