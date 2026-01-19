import { GameObject } from "./Main"

const allNetFunctions = {

    loginUser(userName) {

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: userName
        };

        fetch("/addUser", options)
            .then(response => response.json())
            .then(data => {

                // przykład startu gry dla danego usera

                if (data.display == "none") {
                    GameObject.setPlayer(data)

                    // save player color in html
                    // needed for movement
                    let color = data.color

                    let clientColor = document.getElementById("clientColor")
                    clientColor.innerHTML = color
                }
                else {
                    let statusInfo = document.getElementById("statusInfo")
                    statusInfo.innerHTML = data.message
                }


            }
            )
            .catch(error => console.log(error));

    },
    resetUsers() {

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: "ok" })
        };

        fetch("/resetUsers", options)
            .then(response => response.json())
            .then(data => {

                console.log(data);

                let statusInfo = document.getElementById("statusInfo")
                statusInfo.innerHTML = data.message

            })
            .catch(error => console.log(error));


    },

}

export { allNetFunctions }