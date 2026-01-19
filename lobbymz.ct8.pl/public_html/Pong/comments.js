// currentClientY: null,

// while (game.running) {
//     tick()
// }

// myCheck()

// const divs = document.getElementsByClassName("div")

// console.log(game.running);

// console.log(game.ballLeft);

// if (game.ballTop > 500) {
//     game.upDown = "up"
// }

// console.log(game.ballLeft);
// console.log(game.paletaStart);
// console.log(game.ballTop >= 470 && game.ballLeft > game.paletaStart && game.ballLeft < game.paletaStart + 100);


// if (game.rightLeft == "right") {
//     game.rightLeft = "left"
// }
// else {
//     game.rightLeft = "right"
// }

// console.log(game.ballTop);

function checkBallHitElement() {

    // console.log(game.ball);

    const divs = document.getElementsByClassName("div")

    // console.log(divs.item(1));

    for (let i = 0; i < divs.length; i++) {
        const div = divs.item(i);

        const ball = document.getElementById("ball")

        // console.log(doElsCollide(div, ball));

        // if (doElsCollide(div, ball)) {
        //     console.log("hit");
        //     game.upDown = "down"

        //     div.style.display = "none"
        // }

        // if (!(ball.top > divRect.bottom || ball.right < divRect.left || ball.bottom < divRect.top || ball.left > divRect.right)) {
        //     console.log("hit");
        // }
    }

    // divs.forEach(div => {
    //     const divRect = div.getBoundingClientRect()

    //     if (!(ball.top > divRect.bottom || ball.right < divRect.left || ball.bottom < divRect.top || ball.left > divRect.right)) {
    //         console.log("hit");
    //     }
    // });
}


// const divs = document.getElementsByClassName("div")

// const div = divs[0]

// console.log(div);



// console.log("hes on our height");

// console.log("hes in: ", div.id);

// const topR = getNum(div.style.top) + 100
// const botL
// const botR

// console.log(topL);

// doElsCollide = function (el1, el2) {
//     el1.offsetBottom = el1.offsetTop + el1.offsetHeight;
//     el1.offsetRight = el1.offsetLeft + el1.offsetWidth;
//     el2.offsetBottom = el2.offsetTop + el2.offsetHeight;
//     el2.offsetRight = el2.offsetLeft + el2.offsetWidth;

//     // console.log(el2.offsetRight);

//     return !((el1.offsetBottom < el2.offsetTop) ||
//         (el1.offsetTop > el2.offsetBottom) ||
//         (el1.offsetRight < el2.offsetLeft) ||
//         (el1.offsetLeft > el2.offsetRight))
// };

// calculate middle
const middle = {
    top: topL + 25,
    left: topL + 50
}

// which coordinate are we closest to
const distToLeft = Math.abs(game.ballLeft - topL.left)
const distToRight = Math.abs(game.ballLeft - (topL.left + 100))
const distToTop = Math.abs(game.ballTop - topL.top)
const distToBottom = Math.abs(game.ballTop - botL.left)

if (distToLeft < distToRight && distToLeft < distToTop && distToLeft < distToBottom) {
    // he hit left
    console.log("he hit left");

    game.rightLeft = "left"
}
else if (distToRight < distToTop && distToRight < distToBottom) {
    // he hit right
    console.log("he hit right");

    game.rightLeft = "right"
}
else if (distToTop < distToBottom) {
    // he hit top
    console.log("he hit top");

    game.upDown = "up"
}
else {
    // he hit bottom
    console.log("he hit bot");

    game.upDown = "down"
}