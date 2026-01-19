import { Game } from "./Game.js"

export class Ui {
    constructor() {

        // start game
        const game = new Game()
        game.init()

        let consoleDom = document.getElementById("console")

        consoleDom.value = ""

        window.addEventListener("keydown", (e) => {

            // prevet tab
            if (e.keyCode === 9) {
                e.preventDefault();
            }

            // we need to set a timeout to read the whole user input, letter by letter
            setTimeout(() => {

                // here we run command
                if (e.code == "Enter" && game.status == "working") {
                    // extract command from html input
                    let command = consoleDom.value

                    // run command
                    game.run(command)

                    // clear text
                    consoleDom.value = ""
                }

                // check if we don't have a miss input
                if (game.status == "working") {

                    // here we manage text

                    // find our lovely coursor
                    let cursor = document.getElementById("cursor")

                    // get number from left property
                    let left = cursor.style.left
                    let indexOfP = left.indexOf("p")
                    let leftNum = parseInt(left.slice(0, indexOfP))

                    // refresh the dom element (needed after messages)
                    consoleDom = document.getElementById("console")

                    // check the amount of keys inserted in console
                    let letters = consoleDom.value

                    if (e.code == "Backspace" || e.code == "ArrowLeft") {
                        console.log("backspace");
                        if (game.cursorindex != 0) {
                            leftNum -= 30

                            game.cursorindex -= 1
                        }
                    }
                    else {

                        leftNum += 30

                        game.cursorindex += 1
                    }

                    // here we check if we can go further with cursor, or we need to go back
                    if (game.cursorindex > letters.length) {
                        game.cursorindex -= 1

                        leftNum -= 30
                    }

                    // here we display the right letter
                    // 0 is first letter

                    let letterInCursor = "&nbsp;"

                    if (game.cursorindex >= letters.length) {

                    }
                    else {
                        // find the letter "under" our cursor
                        letterInCursor = letters[game.cursorindex].toUpperCase()

                        // if space, replace with whitespace
                        if (letterInCursor == " " || letterInCursor == "") {
                            letterInCursor = "&nbsp;"
                        }
                    }

                    // put the letter in cursor
                    cursor.innerHTML = letterInCursor

                    cursor.style.left = `${leftNum}px`
                }
                else if (game.status == "gossips" || game.status == "vocabulary") {
                    // we need to skip the first key input, because it is "enter" key from typing the command vocabulay or gossip
                    // without this if , gossips or vocab info disappears immediately
                    if (game.pressedKeyCount == 2) {
                        // bring back game status
                        game.status = "working"

                        let mainGame = document.getElementById("mainGame")
                        let gossips = document.getElementById("gossips")
                        let vocabulary = document.getElementById("vocabulary")

                        // hide gossips and vocabulary
                        gossips.style.display = "none"
                        vocabulary.style.display = "none"

                        // show main game
                        mainGame.style.display = "block"

                        // bring back focus
                        let consoleDom = document.getElementById("console")
                        consoleDom.focus()

                        // set letter interval / cursor interval to default
                        game.cursorindex = 0

                        // fix the position of cursor
                        let cursor = document.getElementById("cursor")
                        cursor.style.left = "300px"

                        // clear the inner side of cursor
                        cursor.innerHTML = "&nbsp;"
                    }
                    game.pressedKeyCount += 1
                }
            }, 5)



        })

        window.addEventListener("click", function (e) {
            // change the focus to our input
            consoleDom.focus()
        })
    }
}