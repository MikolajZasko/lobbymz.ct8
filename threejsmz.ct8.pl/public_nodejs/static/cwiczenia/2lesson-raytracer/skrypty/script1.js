$(document).ready(function () {
    let h2 = $("#h2")

    document.addEventListener("keydown", function (e) {
        console.log(e.keyCode);
        h2.html(e.keyCode)
    })
})