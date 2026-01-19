$(document).ready(function () {

    let lista

    // zdobycie listy plików

    // fetch
    fetch("/fileCheck")
        .then(response => response.json())
        .then(data => {
            // stworzenie linków
            makeLinks(data)
        })
        .catch(err => console.log(err))


    // funkcja tworząca linki

    function makeLinks(x) {

        let main = $("#main")

        for (let i = 0; i < x.length; i++) {
            let capsule = $(`<div id=${i} class=capsule>`)

            let capsuleMain = $(`<div class='capsuleMain'></div>`)

            let h2 = $(`<h2>${x[i][0]}</h2>`)
            capsule.append(h2)

            let container = $(`<div class=container>`)

            for (let j = 0; j < x[i][1].length; j++) {
                if (x[i][1][j] != "skrypty") {

                    let h3ProjectDecription = $(`<h3>${x[i][1][j]}</h3>`)
                    h3ProjectDecription
                        .attr("class", "projectDescription")

                    let newA = $("<a>")
                    newA
                        .attr("href", `../${x[i][0]}/${x[i][1][j]}`)
                        .attr("class", "linkToProject")
                        .html(`go to project`)

                    container.append(h3ProjectDecription)
                    container.append(newA)
                }

            }

            capsuleMain.append(container)

            capsule.append(capsuleMain)

            let h4Bottom = $(`<h4>.</h4>`)
            capsule.append(h4Bottom)

            main.append(capsule)

        }

    }

})