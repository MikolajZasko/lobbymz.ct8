import { Ui } from "./modules/Ui.js"

function start() {
    // time for each photo to be wieved (in ms)
    let singleDuration = 1500

    let introPhotos = ['1.webp', '2.webp', '3.webp']
    let bigPhoto = document.getElementById("bigPhoto")
    let photoNumber = 0

    // roll through photos 
    introPhotos.forEach(photo => {
        setTimeout(() => {
            bigPhoto.src = `introPhotos/${photo}`

        }, singleDuration * photoNumber)

        photoNumber += 1
    });

    // hide big photo
    setTimeout(() => {
        bigPhoto.style.display = "none"
    }, introPhotos.length * singleDuration);

    // play music track
    let audio = new Audio("Hejnal_Mariacki.mp3")
    audio.play()


    setTimeout(() => {
        // game start
        new Ui

        // // pause audio
        // audio.pause()
    }, introPhotos.length * singleDuration);

    // remove event listener
    document.removeEventListener("click", start)
}

// wait for user interaction - needed for music track to work
document.addEventListener("click", start)