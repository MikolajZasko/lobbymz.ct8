// global variables
const game = {
    upDown: "up",
    rightLeft: "right",
    running: true,

    ballTop: 495,
    ballLeft: 250,

    interval: null,
    ball: null,
    paleta: null,
    paletaStart: null,

    currentClientX: null,

    lifes: 3,
    divs: []
}

document.addEventListener("DOMContentLoaded", function () {
    const main = document.getElementById("main")

    // generate divs (red rects)
    let n = 0
    for (let i = 0; i < 5; i++) {
        for (let t = 0; t < 3; t++) {
            const div = document.createElement("div")

            div.style.left = i * 100 + 10 + "px"
            div.style.top = t * 50 + 10 + "px"
            div.classList.add("div")
            div.id = n

            game.divs[n] = div

            main.append(div)

            n += 1
        }


    }

    // find ball + paleta elements
    game.ball = document.getElementById("ball")
    game.paleta = document.getElementById("paleta")

    // start game
    game.interval = setInterval(() => {
        tick()
    }, 1);


})

function tick() {
    // check if ball in any of the rect's
    for (let index = 0; index < game.divs.length; index++) {
        const div = game.divs[index];

        if (div != null) {
            myCheck(div)
        }
    }

    // if game running, update ball position:
    if (game.running) {
        // update ball position in global variables
        if (game.upDown == "up") {
            game.ballTop -= 1
        }
        else {
            game.ballTop += 1
        }

        if (game.rightLeft == "right") {
            game.ballLeft += 1
        }
        else {
            game.ballLeft -= 1
        }

        // update ball position in html
        updateBallPos()

        // check if ball hitted paleta
        checkBallHitPaleta()

        // check if ball hitted bottom (-1 life)
        checkBallHitBottom()
    }
}

// update ball position in html
function updateBallPos() {
    game.ball.style.left = game.ballLeft + "px"
    game.ball.style.top = game.ballTop + "px"

    if (game.ballLeft > 500) {
        game.rightLeft = "left"
    }

    if (game.ballLeft < 15) {
        game.rightLeft = "right"
    }

    if (game.ballTop < 15) {
        game.upDown = "down"
    }

}

// check if ball hitted paleta
function checkBallHitPaleta() {
    // count where is paleta

    if (game.ballTop >= 500 && game.ballLeft > game.paletaStart && game.ballLeft < game.paletaStart + 100) {
        // perform bounce
        game.upDown = "up"
    }
}

// movement for paleta (on your mouse)
document.addEventListener("mousemove", function (e) {
    if (e.clientX < 10) {
        game.paleta.style.left = "10px"
        game.paletaStart = 10
    }

    else if (e.clientX > 410) {
        game.paleta.style.left = "410px"
        game.paletaStart = 410
    }
    else {
        game.paleta.style.left = e.clientX + "px"
        game.paletaStart = e.clientX
    }
})

// check if ball hitted bottom (-1 life)
function checkBallHitBottom() {
    if (game.ballTop >= 505) {
        // stop the game for 1s
        game.running = false

        clearInterval(game.interval)

        if (game.lifes > 0) {
            // remove 1 life
            game.lifes -= 1

            // retrieve ball to original location:

            // in html
            game.ball.style.top = "495px"
            game.ball.style.left = "250px"

            // in global variables
            game.ballLeft = 250
            game.ballTop = 495

            // set default directions
            game.upDown = "up"
            game.rightLeft = "right"

            // start game after 1s
            setTimeout(() => {
                game.running = true
                game.interval = setInterval(() => {
                    tick()
                }, 1);
            }, 1000);

        }
        else {
            // display game over
            console.log("gg");
        }
    }
}

// check if ball in div given in variable
function myCheck(div) {
    // corners
    const topL = {
        left: getNum(div.style.left),
        top: getNum(div.style.top)
    }
    const botR = {
        left: getNum(div.style.left) + 100,
        top: getNum(div.style.top) + 50
    }
    // const topR = {
    //     left: getNum(div.style.left) + 100,
    //     top: getNum(div.style.top)
    // }
    const botL = {
        left: getNum(div.style.left),
        top: getNum(div.style.top) + 50
    }

    // here we everywhere add 5 to increase the range of ball hitting the red rect

    // ball on our height
    if (game.ballTop + 10 < botR.top && game.ballTop + 10 > topL.top) {

        // ball in our div element
        if (game.ballLeft + 10 > topL.left && game.ballLeft + 10 < botR.left) {

            // check which side is he closest to 

            let bounced = false

            // bottom
            if (game.ballTop - topL.top > game.ballTop - botR.top) {
                console.log("he hit bot");

                game.upDown = "down"

                bounced = true
            }

            // top
            if (game.ballTop - topL.top < game.ballTop - botR.top) {
                console.log("he hit top");

                game.upDown = "up"

                bounced = true
            }

            // right
            if (game.ballLeft - topL.left > game.ballLeft - botR.left) {
                if (game.rightLeft == "left") {
                    // impossible skip frame
                }
                else {
                    console.log("he hit right");

                    game.rightLeft = "right"

                    bounced = true
                }

            }

            // left
            if (game.ballLeft - topL.left < game.ballLeft - botR.left) {
                if (game.rightLeft == "right") {
                    // impossible skip frame
                }
                else {
                    console.log("he hit left");

                    game.rightLeft = "left"

                    bounced = true
                }
            }

            if (bounced) {
                // hide div in html
                div.style.display = "none"

                // remove div from visible array
                game.divs[div.id] = null
            }

        }
    }
}

// takes number like 90px returns 90
function getNum(pxVal) {
    return parseInt(pxVal.split("p")[0])
}

