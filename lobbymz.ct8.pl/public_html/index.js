document.addEventListener("DOMContentLoaded", function () {
    // all projects
    const projects = [
        {
            title: "dratewka",
            startFile: "dratewka/index.html",
            tech: "JS"
        },
        {
            title: "librus",
            startFile: "librus/login.php",
            tech: "PHP"
        },
        {
            title: "XO",
            startFile: "XO/index.html",
            tech: "PHP"
        },
        {
            title: "snake",
            startFile: "snake/index.html",
            tech: "JS"
        },
        {
            title: "PongUnfinished",
            startFile: "Pong/index.html",
            tech: "JS"
        },
        {
            title: "memory",
            startFile: "memory/index.html",
            tech: "JS"
        },
        {
            title: "battleship game",
            startFile: "ships/index.html",
            tech: "JS"
        },
        {
            title: "rocket",
            startFile: "rocket/index.html",
            tech: "jQuery"
        },
        {
            title: "ThreeJS",
            startFile: "https://threejsmz.ct8.pl",
            tech: "ThreeJS"
        },
        {
            title: "FileManager",
            startFile: "https://filemanagermz.ct8.pl",
            tech: "Express (Node.js)"
        },
        {
            title: "checkers",
            startFile: "https://checkersmz.ct8.pl",
            tech: "Vite"
        },
        {
            title: "3DhexMap",
            startFile: "https://hexmz.ct8.pl",
            tech: "Vite"
        },
        {
            title: "Vue",
            startFile: "https://vuemz.ct8.pl",
            tech: "Vue"
        },
        {
            title: "mapGenerator",
            startFile: "mapGenerator/index.html",
            tech: "TS"
        },
        {
            title: "mapGenerator_v2",
            startFile: "mapGenerator_v2/index.html",
            tech: "TS"
        },
        // {
        //     title: "",
        //     startFile: "",
        //     tech: "Node.js"
        // },
        // {
        //     title: "",
        //     startFile: "",
        //     tech: "Node.js"
        // },
        // {
        //     title: "",
        //     startFile: "",
        //     tech: ""
        // },
    ]

    // all technologies
    const technologies = [
        {
            name: "JS",
            primaryColor: "#f6fa2d"
        },
        {
            name: "TS",
            primaryColor: "#3178c6"
        },
        {
            name: "PHP",
            primaryColor: "#8435f2"
        },
        {
            name: "jQuery",
            primaryColor: "#0769ad"
        },
        // {
        //     name: "Node.js",
        //     primaryColor: "#417e38"
        // },
        {
            name: "ThreeJS",
            primaryColor: "#FFFFFF"
        },
        {
            name: "Express (Node.js)",
            primaryColor: "#3fb3e0"
        },
        {
            name: "Vite",
            primaryColor: "#996cf4"
        },
        {
            name: "Vue",
            primaryColor: "#47ba87"
        },
        // {
        //     name: "",
        //     primaryColor: ""
        // },
    ]

    // create all capsules
    const main = document.getElementById("main")

    technologies.forEach(technologyObj => {
        const capsule = document.createElement("div")
        capsule.classList.add("capsule")
        // capsule.id = technologyObj.name

        const h2Top = document.createElement("h2")
        h2Top.innerHTML = technologyObj.name
        h2Top.style.backgroundColor = technologyObj.primaryColor
        capsule.append(h2Top)

        const capsuleMain = document.createElement("div")
        capsuleMain.classList.add("capsuleMain")
        capsuleMain.id = technologyObj.name
        capsule.append(capsuleMain)

        const h4Bottom = document.createElement("h4")
        h4Bottom.innerHTML = "."
        h4Bottom.style.color = technologyObj.primaryColor
        h4Bottom.style.backgroundColor = technologyObj.primaryColor
        capsule.append(h4Bottom)

        main.append(capsule)
    })

    // add projects to capsules
    projects.forEach(project => {
        // find capsuleMain
        const capsuleMain = document.getElementById(project.tech)

        // create div
        const div = document.createElement("div")
        div.className = "container"

        // create description
        const h3 = document.createElement("h3")
        h3.innerHTML = project.title
        h3.className = "projectDescription"

        // create link
        const a = document.createElement("a")
        a.href = project.startFile
        a.innerHTML = "go to project"
        a.className = "linkToProject"

        div.append(h3)
        div.append(a)

        capsuleMain.append(div)
    });
})