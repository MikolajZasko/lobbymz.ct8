import { allNetFunctions } from "./Net";

const allEvents = {

    init() {

        document.getElementById("loginBt").onclick = function () {

            console.log("loginbt");

            let nickName = document.getElementById("nickName").value

            nickName = JSON.stringify({ nickName: nickName })

            allNetFunctions.loginUser(nickName)

        }

        document.getElementById("resetBt").onclick = function () {

            console.log("resetBt");

            allNetFunctions.resetUsers()
        }

    }

}

export { allEvents }