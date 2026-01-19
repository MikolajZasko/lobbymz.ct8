document.addEventListener("DOMContentLoaded", function () {
    // apply cookies
    const cookieValue = getCookie("capsuleDisplay")

    const lobbyCapsule = document.getElementsByClassName("lobbyCapsule")[0]
    const hideLobbyButton = document.getElementById("hideLobby")

    if (cookieValue == "none" || cookieValue == "flex") {
        lobbyCapsule.style.display = cookieValue

        if (cookieValue == "none") {
            hideLobbyButton.innerHTML = "show lobby"
        }
        else {
            hideLobbyButton.innerHTML = "hide lobby"
        }
    }
})

function hideCapsule() {
    // cookies
    const cookieValue = getCookie("capsuleDisplay")

    const lobbyCapsule = document.getElementsByClassName("lobbyCapsule")[0]
    const hideLobbyButton = document.getElementById("hideLobby")

    if (cookieValue == "none") {
        lobbyCapsule.style.display = "flex"

        hideLobbyButton.innerHTML = "hide lobby"

        setCookie("capsuleDisplay", "flex", 1)
    }
    else {
        lobbyCapsule.style.display = "none"

        hideLobbyButton.innerHTML = "show lobby"

        setCookie("capsuleDisplay", "none", 1)

    }
}

function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

function setCookie(name, value, hours) {
    var expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (hours * 60 * 60 * 1000)); // Convert hours to milliseconds
    var expires = "expires=" + expirationDate.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}