// zmienne
const { log } = require("console");
const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path");
const { message } = require("statuses");
const formidable = require('formidable')
const fs = require("fs")

const hbs = require('express-handlebars');
const { after } = require("node:test");
const cookieparser = require("cookie-parser");
const nocache = require("nocache");

let allFiles = []
let fileCounter = 0

// użycie parsera
app.use(express.urlencoded({ extended: true }))

// użycie JSON
app.use(express.json())

// cookie
app.use(cookieparser())

// wyłączenie możliwości cofania się
// potrzebne do systemu logowania
app.use(nocache())

// czyszczenie folderu upload na start serwera

const directory = "static/upload";

fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
        fs.unlink(path.join(directory, file), (err) => {
            if (err) throw err;
        });
    }
});

// obsługa rządań
app.get("/", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        res.render("upload.hbs")
    }
    else {
        res.redirect("/login")
    }
})

function checkIfLoggedIn(userName) {
    console.log(userName);
    if (userName) {

        // check if user present
        let userFind = loggedUsers.find(user => {
            return user.userName == userName
        })
        if (userFind) {
            console.log("user is logged in");

            return true
        }
        else {
            console.log("user is not logged in");

            return false
        }
    }
    else {
        console.log("user is not logged in");

        return false
    }
}

app.post("/upload", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        let form = formidable({})

        // folder do zapisu zdjecia
        form.uploadDir = __dirname + '/static/upload'

        // zachowanie rozszerzeń
        form.keepExtensions = true

        // wiele plików
        form.multiples = true

        form.parse(req, function (err, fields, files) {
            console.log("----- przesłane pola z formularza ------");

            console.log(fields);

            console.log("----- przesłane formularzem pliki ------");

            console.log(files);

            console.log("here testing");

            if (!Array.isArray(files.files)) {
                // mamy jeden plik
                console.log("one");

                addFileToArr(files.files)

            }
            else {
                // mamy wiele plików
                console.log("more");

                let amountOfFiles = files.files.length

                for (let i = 0; i < amountOfFiles; i++) {
                    const element = files.files[i];

                    addFileToArr(element)
                }
            }
            console.log(allFiles);

            res.redirect("/filemanager")

        })
    }
    else {
        res.redirect("/login")
    }


})

function addFileToArr(file) {
    let type = file.type
    let size = file.size
    let name = file.name

    // potrzebujemy tylko ostatniego elementu z path czyli nazwę pliku jaką ma upload
    let writeStreamPath = file._writeStream.path.split("\\")
    let uploadPath = writeStreamPath[writeStreamPath.length - 1]

    // console.log(uploadName);

    let imgPath

    if (type == "image/png") {
        imgPath = "gfx/png.png"
    }
    else if (type == "image/jpg") {
        imgPath = "gfx/jpg.png"
    }
    else if (type == "image/jpeg") {
        imgPath = "gfx/jpg.png"
    }
    else if (type == "text/plain") {
        imgPath = "gfx/txt.png"
    }
    // else if (type == "") {

    // }
    // else if (type == "") {

    // }
    else {
        imgPath = "gfx/other.png"
    }

    allFiles.push({
        id: fileCounter,
        type: type,
        name: name,
        size: size,
        imgPath, imgPath,
        uploadPath: uploadPath,
        savedate: new Date().getTime()
    })

    fileCounter += 1
}


app.get("/filemanager", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        res.render('filemanager.hbs', { allFiles: allFiles });
    }
    else {
        res.redirect("/login")
    }
})

app.get("/show", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        let id = req.query.id

        let fileData = allFiles[id]

        console.log(fileData);

        let type = fileData.type.split('/')

        type = type[0]

        console.log(type);

        if (type == "image") {

            let imagePath = fileData.uploadPath

            fs.readFile(imagePath, (err, fileData) => {
                if (err) {
                    // Obsłuż błędy odczytu pliku
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    // Ustaw nagłówki odpowiedzi
                    res.setHeader('Content-Type', 'image/jpeg');
                    // Wyślij zawartość pliku jako odpowiedź
                    res.send(fileData);
                }
            });
        }
        else if (type == "text") {
            fs.readFile(path.join(__dirname + "/static/" + fileData.uploadPath), function (err, data) {
                res.send("here is your txt file content: \n <pre>" + data + "</pre>")
            })
        }
        else {
            res.send("unknown file type, not sure how to display it")
        }
    }
    else {
        res.redirect("/login")
    }
})

app.get("/info", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        if (typeof req.query.id !== 'undefined') {
            console.log(allFiles);
            console.log(req.query.id);

            let id = req.query.id

            let fileData = allFiles[id]

            let name = fileData.name

            let pathToFile = path.join(__dirname + "/static/" + fileData.uploadPath)

            let size = fileData.size

            let type = fileData.type

            let savedate = fileData.savedate

            let context = {
                id: id,
                name: name,
                path: pathToFile,
                size: size,
                type: type,
                savedate: savedate
            }

            res.render("info.hbs", context)
        }
        else {
            res.render("info.hbs")
        }
    }
    else {
        res.redirect("/login")
    }

})

app.get('/download', function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        let id = req.query.id

        let fileData = allFiles[id]

        console.log(fileData);

        const file = fileData.uploadPath
        res.download(file); // Set disposition and send it.
    }
    else {
        res.redirect("/login")
    }
});

app.get('/delete', function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        let id = req.query.id

        allFiles[id] = ""

        res.redirect("/filemanager")
    }
    else {
        res.redirect("/login")
    }
})

app.get('/deleteTable', function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        for (let i = 0; i < allFiles.length; i++) {
            allFiles[i] = ""
        }

        res.redirect("/filemanager")
    }
    else {
        res.redirect("/login")
    }
})

let names = []

app.get("/filemanager2", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        let dirPath

        // find available extensions
        let availableExtensions = []
        // = ["css", "html", "jpeg", "jpg", "js", "json", "pdf", "png", "txt", "xml"]

        let extensionDirPath = path.join(__dirname, "static", "gfx")

        fs.readdir(extensionDirPath, (err, files) => {
            if (err) throw err
            // console.log("lista", files);

            for (let h = 0; h < files.length; h++) {
                let fileName = files[h]

                let lastIndex = fileName.lastIndexOf(".")
                let extension = fileName.slice(0, lastIndex)

                availableExtensions.push(extension)
            }

            // the code continues

            if (req.query.path) {
                dirPath = path.join(__dirname, "static/upload2", req.query.path)
                if (req.query.path.length <= 1) {
                    dirPath = path.join(__dirname, "static/upload2")
                }
            }
            else {
                dirPath = path.join(__dirname, "static/upload2")
            }

            let context = {
                files: [],
                root: ""
            }

            // find just the dir we are in
            let root = req.query.path

            if (req.query.path) {
                context.root = root
                context.rename = true

                // get the name of current dir
                let name = root.split("/")
                name = name[name.length - 1]

                context.name = name
            }

            // make the clickable links to previous folders
            if (root) {
                console.log("root present");

                let road = root.split("/")
                road.shift()

                road.unshift("home")

                let fullRoad = []

                // for each direcroty make a full path/link
                for (let i = 0; i < road.length; i++) {
                    let oneRoad = ''

                    // then add each previous directory
                    for (let j = 1; j < i + 1; j++) {
                        const element = road[j];
                        oneRoad = oneRoad + "/" + element

                    }

                    if (oneRoad.length <= 1) {
                        oneRoad = ""
                    }
                    console.log(oneRoad);
                    fullRoad.push(oneRoad)
                }

                let raodArr = []

                // form a proper object
                for (let i = 0; i < road.length; i++) {
                    let obj
                    if (i == road.length - 1) {
                        obj = {
                            name: road[i],
                            href: fullRoad[i],
                            last: true
                        }
                    }
                    else {
                        obj = {
                            name: road[i],
                            href: fullRoad[i]
                        }
                    }

                    raodArr.push(obj)
                }

                context.raodArr = raodArr
                console.log(raodArr);
            }
            else {
                console.log("root not present");

                root = ""

                context.raodArr = [{ name: 'home', href: '', last: true }]
            }

            fs.readdir(dirPath, (err, files) => {
                // zapisanie nazw plików i katalogów do zmiennej globalnej

                names = files

                files.forEach((file) => {

                    let filePath

                    if (req.query.path) {
                        filePath = path.join(__dirname, "static/upload2", req.query.path, file)
                    }
                    else {
                        filePath = path.join(__dirname, "static/upload2", file)
                    }

                    fs.lstat(filePath, (err, stats) => {
                        // console.log(file, stats.isDirectory());

                        if (stats.isDirectory()) {
                            file = {
                                name: file,
                                directory: true,
                                root: root
                            }

                        }
                        else {
                            let extension = getExtension(file)

                            // check if we have the right extension img
                            let isNotOther = false

                            for (let g = 0; g < availableExtensions.length; g++) {
                                const element = availableExtensions[g];
                                if (extension == element) {
                                    isNotOther = true
                                }
                            }

                            // if no extension, give it  "other" img
                            if (extension == "" || isNotOther == false) {
                                extension = "other"
                            }


                            let extensionPath = `\\gfx\\${extension}.png`

                            file = {
                                name: file,
                                extension: extension,
                                extensionPath: extensionPath,
                                file: true,
                                root: root
                            }

                            // check if file is image
                            // for now we accept only 3 formats
                            if (extension == "png" || extension == "jpg" || extension == "jpeg") {
                                file.image = true
                                file.file = false
                            }

                        }
                        context.files.push(file)

                    })
                })
                console.log(context);
                setTimeout(() => {
                    res.render('filemanager2.hbs', context);
                }, 50);

                if (err) throw err
                // console.log("lista", files);

            })
        })
    }
    else {
        res.redirect("/login")
    }
})

function getExtension(fileName) {
    let extensionIndex = fileName.lastIndexOf(".")
    let extension = fileName.slice(extensionIndex)

    // delete dot
    extension = extension.slice(1)

    // check if it is a copy
    let extensionCopy = extension.split("_")

    // if it is a copy, change the extension to be without _98210398219
    if (extensionCopy.length >= 2) {
        extension = extensionCopy[0]
    }

    return extension
}

function basicFileContent(extension) {
    if (extension == "js") {
        return "<script>console.log('to jest plik js')</script>"
    }
    else if (extension == "html") {
        return `<!DOCTYPE html>\n<html lang="en">\n\t<head>\n\t\t<meta charset="UTF-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t\t<title>TEST HTML</title>\n\t</head>\n\t<body>\n\n\t</body>\n</html>`
    }
    else if (extension == "css") {
        return `body {\n\tbackground-color: red;\n}`
    }
    else if (extension == "json") {
        return `{\n\t"a": 1,\n\t"b": 2,\n\t"c": 3\n}`
    }
    else if (extension == "txt") {
        return `Przykładowy plik txt`
    }
    else if (extension == "xml") {
        return `<?xml version="1.0"?>\n<customers>\n\t<customer id="55000">\n\t\t<name>Charter Group</name>\n\t\t<address>\n\t\t\t<street>100 Main</street>\n\t\t\t<city>Framingham</city>\n\t\t\t<state>MA</state>\n\t\t\t<zip>01701</zip>\n\t\t</address>\n\t\t<address>\n\t\t\t<street>720 Prospect</street>\n\t\t\t<city>Framingham</city>\n\t\t\t<state>MA</state>\n\t\t\t<zip>01701</zip>\n\t\t</address>\n\t\t<address>\n\t\t\t<street>120 Ridge</street>\n\t\t\t<state>MA</state>\n\t\t\t<zip>01760</zip>\n\t\t</address>\n\t</customer>\n</customers>`
    }
    else return ""
}

app.get("/nowyFolder", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        let root = req.query.root
        let name = req.query.name

        let newDirPath

        // check if root is empty, if so don't pass it into path.join()
        // an error will occur
        if (root != "") {
            newDirPath = path.join(__dirname, "static/upload2", root, name)
        }
        else {
            newDirPath = path.join(__dirname, "static/upload2", name)
        }


        if (!fs.existsSync(newDirPath)) {
            fs.mkdir(newDirPath, (err) => {
                res.redirect(`/filemanager2?path=${root}`)
            })
        }
        else {
            let timestamp = Date.now()

            // check if root is empty, if so don't pass it into path.join()
            // an error will occur
            if (root != "") {
                newDirPath = path.join(__dirname, "static/upload2", root, `kopia_${name}_${timestamp}`)
            }
            else {
                newDirPath = path.join(__dirname, "static/upload2", `kopia_${name}_${timestamp}`)
            }

            fs.mkdir(newDirPath, (err) => {
                res.redirect(`/filemanager2?path=${root}`)
            })
        }
    }
    else {
        res.redirect("/login")
    }
})

app.get("/nowyPlik", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        let root = req.query.root

        let name = req.query.name

        let newFilePath

        // check if root is empty, if so don't pass it into path.join()
        // an error will occur
        if (root != "") {
            newFilePath = path.join(__dirname, "static/upload2", root, name)
        }
        else {
            newFilePath = path.join(__dirname, "static/upload2", name)
        }

        // separate name and extension
        let extension = getExtension(name)

        let dotIndex = name.lastIndexOf(".")
        name = name.slice(0, dotIndex)

        // get basic file content
        let innerText = basicFileContent(extension)

        if (!fs.existsSync(newFilePath)) {
            fs.writeFile(newFilePath, innerText, (err) => {
                if (err) throw err
                res.redirect(`/filemanager2?path=${root}`)
            })
        }
        else {
            let timestamp = Date.now()

            // check if root is empty, if so don't pass it into path.join()
            // an error will occur
            if (root != "") {
                newFilePath = path.join(__dirname, "static/upload2", root, `kopia_${name}_${timestamp}.${extension}`)
            }
            else {
                newFilePath = path.join(__dirname, "static/upload2", `kopia_${name}_${timestamp}.${extension}`)
            }

            fs.writeFile(newFilePath, innerText, (err) => {
                if (err) throw err
                res.redirect(`/filemanager2?path=${root}`)
            })
        }
    }
    else {
        res.redirect("/login")
    }
})

app.get("/usunPlik", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        let name = req.query.name
        let root = req.query.root

        let delFilePath

        // check if root is empty, if so don't pass it into path.join()
        // an error will occur
        if (root != "") {
            delFilePath = path.join(__dirname, "static/upload2", root, name)
        }
        else {
            delFilePath = path.join(__dirname, "static/upload2", name)
        }

        if (fs.existsSync(delFilePath)) {
            console.log("plik istnieje");
            fs.unlink(delFilePath, (err) => {
                if (err) throw err
                res.redirect(`/filemanager2?path=${root}`)
            })

        } else {
            console.log("plik nie istnieje");
            res.send("Internal Error, file that you want to delete is not present")
        }
    }
    else {
        res.redirect("/login")
    }
})

app.get("/usunKatalog", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        let name = req.query.name
        let root = req.query.root

        let delFilePath

        // check if root is empty, if so don't pass it into path.join()
        // an error will occur
        if (root != "") {
            delFilePath = path.join(__dirname, "static/upload2", root, name)
        }
        else {
            delFilePath = path.join(__dirname, "static/upload2", name)
        }


        if (fs.existsSync(delFilePath)) {
            console.log("plik istnieje");
            fs.rmSync(delFilePath, { recursive: true, force: true })
            res.redirect(`/filemanager2?path=${root}`)

        } else {
            console.log("plik nie istnieje");
            res.send("Internal Error, file that you want to delete is not present")
        }
    }
    else {
        res.redirect("/login")
    }
})

app.post("/wybierzPlik", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        let form = formidable({})

        // folder do zapisu zdjecia
        form.uploadDir = __dirname + '/static/upload2'

        // zachowanie rozszerzeń
        form.keepExtensions = true

        // wiele plików
        form.multiples = true

        form.on('fileBegin', function (name, file) {

            // usuwa spacje
            file.name = file.name.replaceAll("&nbsp;", "_")
            file.name = file.name.replaceAll(" ", "_")

            // sprawdzenie czy nazwa już występuje, jeśli tak podmiana nazwy pliku
            if (names.includes(file.name)) {
                console.log("name present we change");

                let date = Date.now()

                let extensionIndex = file.name.lastIndexOf(".")
                let extension = file.name.slice(extensionIndex)
                let fileName = file.name.slice(0, extensionIndex)

                file.path = form.uploadDir + "/kopia_" + fileName + `_${date}` + extension;
            }
            else {
                console.log("name new, adding..");
                file.path = form.uploadDir + "/" + file.name;
            }

        })

        form.parse(req, function (err, fields, files) {
            console.log("----- przesłane pola z formularza ------");

            console.log(fields);

            console.log("----- przesłane formularzem pliki ------");

            console.log(files);

            console.log("here testing");

            res.redirect("/filemanager2")

        })
    }
    else {
        res.redirect("/login")
    }
})

app.get("/zmienNazwe", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        let root = req.query.root
        let newName = req.query.name

        // get all except the name of current dir
        let preRoot = root.split("/")
        preRoot.pop()

        preRoot = preRoot.toString().replaceAll(',', '/')

        let newPath = path.join(__dirname, "static/upload2", preRoot, newName)
        let oldPath = path.join(__dirname, "static/upload2", root)

        if (!fs.existsSync(newPath)) {
            fs.rename(oldPath, newPath, (err) => {
                if (err) console.log(err)
                else {
                    let newRoot = preRoot + "/" + newName
                    console.log(newRoot);
                    res.redirect(`/filemanager2?path=${newRoot}`)
                }
            })
        }
        else {
        }
    }
    else {
        res.redirect("/login")
    }
})

let fontSize = 20

let colorIndex = 0
let backgroundColorList = ["#000000", "#ffffff", "#90e1a6", "#47afe7", "#5e9a19", "#baebfc", "#e642f5"]
let textColorList = ["#ffffff", "#000000", "#9aa78f", "#3f1269", "#687c4e", "#02d673", "#57aefa"]

app.get("/edit", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        let filePath = req.query.name

        // find full path
        let fullPath = path.join(__dirname, "static/upload2", filePath)

        // find just the filename (needed to change fileName)
        let lastIndex = filePath.lastIndexOf("/")
        let filename = filePath.slice(lastIndex + 1)

        // get just the directory
        let root = filePath.slice(0, lastIndex)

        // read file contents
        fs.readFile(fullPath, (err, data) => {
            if (err) throw err

            const context = {
                innerText: data.toString(),
                fileRoot: filePath,
                fontSize: fontSize,
                filename: filename,
                root: root
            }

            // generate site
            res.render("edit.hbs", context)
        })
    }
    else {
        res.redirect("/login")
    }
})

app.post("/font", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        // check if we + or - the font and send it back

        if (req.body.direction == "+") {
            fontSize += 3
        }
        else if (req.body.direction == "-") {
            fontSize -= 3
        }

        res.send({ fontSize: fontSize })
    }
    else {
        res.redirect("/login")
    }
})

app.post("/color", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        if (req.body.symbol == "+") {
            // change the colorIndex +1
            colorIndex += 1

            // if colorIndex index is too much, bring back to 0
            if (colorIndex == 7) {
                colorIndex = 0
            }
        }

        res.send({
            message: "ok",
            backgroundColor: backgroundColorList[colorIndex],
            textColor: textColorList[colorIndex]
        })
    }
    else {
        res.redirect("/login")
    }
})

app.post("/saveFile", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        let text = req.body.text
        let fileRoot = req.body.fileRoot

        let filepath = path.join(__dirname, "static/upload2", fileRoot)

        fs.writeFile(filepath, text, (err) => {
            if (err) throw err
            console.log("plik zapisany");

            console.log(text);

            res.send({ message: "ok" })
        })
    }
    else {
        res.redirect("/login")
    }
})

app.post("/changeFileName", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        let root = req.body.root
        let newName = req.body.name
        let oldFilePath = req.body.file

        // find extension
        let lastIndex = oldFilePath.lastIndexOf(".")
        let extension = oldFilePath.slice(lastIndex)

        let newPath = path.join(__dirname, "static/upload2", root, newName + extension)
        let oldPath = path.join(__dirname, "static/upload2", oldFilePath)

        let timestamp = Date.now()

        let newRedirect

        if (!fs.existsSync(newPath)) {
            newRedirect = path.join(root, newName + extension)
        }
        else {
            newRedirect = path.join(root, `kopia_${newName}_${timestamp}` + extension)
            newPath = path.join(__dirname, "static/upload2", root, `kopia_${newName}_${timestamp}` + extension)
            console.log("no takie jaja");
        }



        fs.rename(oldPath, newPath, (err) => {
            if (err) console.log(err)
            else {
                if (extension == ".jpg" || extension == ".png" || extension == ".jpeg") {
                    // here for images
                    res.redirect(`/image?name=/${newRedirect}`)
                }
                else {
                    // here for text files
                    res.redirect(`/edit?name=${newRedirect}`)
                }

            }
        })
    }
    else {
        res.redirect("/login")
    }
})

app.get("/image", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        let filePath = req.query.name

        console.log("image");
        console.log(filePath);

        // find full path
        let fullPath = path.join(__dirname, "static/upload2", filePath)

        // find just the filename (needed to change fileName)
        let lastIndex = filePath.lastIndexOf("/")
        let filename = filePath.slice(lastIndex + 1)

        // get just the directory
        let root = filePath.slice(0, lastIndex)

        // read file contents
        fs.readFile(fullPath, (err, data) => {
            if (err) throw err

            const effects = [
                {
                    filterName: "grayscale",
                    filePath: `./upload2${filePath}`
                },
                {
                    filterName: "invert",
                    filePath: `./upload2${filePath}`
                },
                {
                    filterName: "sepia",
                    filePath: `./upload2${filePath}`
                },
                {
                    filterName: "defaultImg",
                    filePath: `./upload2${filePath}`
                }
            ]

            const context = {
                imgString: data.toString(),
                fileRoot: filePath,
                fontSize: fontSize,
                filename: filename,
                root: root,
                effects: effects,
                filePath: `./upload2${filePath}`
            }

            // generate site
            res.render("image.hbs", context)
        })
    }
    else {
        res.redirect("/login")
    }
})

app.post("/saveimage", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        if (req.body.partialPath != undefined) {
            let dataUrl = req.body.dataUrl
            let partialPath = req.body.partialPath.replaceAll("&nbsp;", "_")
            partialPath = partialPath.replaceAll(" ", "_")

            let fullPath = path.join(__dirname, "static", "upload2", partialPath)

            console.log(partialPath);

            fs.unlink(fullPath, (err) => {
                const buffer = Buffer.from(dataUrl.split(",")[1], 'base64');
                fs.writeFileSync(fullPath, buffer);

                res.header("content-type", "application/json")
                res.send({ message: "image saved" })
            })
        }
        else {
            res.header("content-type", "application/json")
            res.send({ message: "image not saved" })
        }
    }
    else {
        res.redirect("/login")
    }
})

app.get("/lookUp", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        let filePath = req.query.filePath

        let imagePath = path.join(__dirname, 'static', filePath)

        fs.readFile(imagePath, (err, fileData) => {
            if (err) {
                // Obsłuż błędy odczytu pliku
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                // Ustaw nagłówki odpowiedzi
                res.setHeader('Content-Type', 'image/jpeg');
                // Wyślij zawartość pliku jako odpowiedź
                res.send(fileData);
            }
        });
    }
    else {
        res.redirect("/login")
    }
})

let loggedUsers = [
    {
        userName: "test",
        password: "test"
    },
    {
        userName: "1",
        password: "1"
    }
]

app.get("/login", function (req, res) {
    res.render("authentication/login.hbs", { layout: 'auth.hbs' })
})

app.post("/loginForm", function (req, res) {
    // console.log(req.body);
    let userName = req.body.userName
    let password = req.body.password
    // find user
    let userFind = loggedUsers.find(user => {
        return user.userName == userName
    })
    console.log("here: ");
    console.log(userFind);
    if (userFind) {
        // check password
        if (userFind.password == password) {
            // we are logged, create cookie
            res.cookie("login", userName, { httpOnly: true, maxAge: 300 * 1000 });

            res.redirect("/yourAccount")
        }
        else {
            const message = `wrong password for '${userName}'`

            res.render("authentication/error.hbs", { layout: 'auth.hbs', message: message })
        }
    }
    else {
        const message = `user '${userName}' not present`

        res.render("authentication/error.hbs", { layout: 'auth.hbs', message: message })
    }

})

app.get("/register", function (req, res) {
    res.render("authentication/register.hbs", { layout: 'auth.hbs' })
})

app.post("/registerForm", function (req, res) {
    console.log(req.body);
    let userName = req.body.userName
    let password = req.body.password
    let confirmPassword = req.body.confirmPassword

    // check if user present
    let userFind = loggedUsers.find(user => {
        return user.userName == userName
    })

    if (userFind) {
        const message = `user '${userName}' already present`

        res.render("authentication/error.hbs", { layout: 'auth.hbs', message: message })
    }
    else {
        // check if confirmPassword == password
        if (password == confirmPassword) {
            // add user if not present

            let userObj = {
                userName: userName,
                password: password,
            }

            loggedUsers.push(userObj)

            res.redirect("/login")
        }
        else {
            const message = `confirmPassword is different from password`

            res.render("authentication/error.hbs", { layout: 'auth.hbs', message: message })
        }
    }

})

app.get("/yourAccount", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        res.render("authentication/yourAccount.hbs", { layout: 'auth.hbs', userName: userName })
    }
    else {
        res.redirect("/login")
    }

})

app.get("/logout", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues
        res.render("authentication/logout.hbs", { layout: 'auth.hbs' })
    }
    else {
        res.redirect("/login")
    }
})

app.get("/logoutForm", function (req, res) {
    const userName = req.cookies.login

    if (checkIfLoggedIn(userName)) {
        // here code continues

        // delete cookie
        res.clearCookie("login");

        res.render("authentication/login.hbs", { layout: 'auth.hbs' })
    }
    else {
        res.redirect("/login")
    }
})


let t = [1, 2, 3].find(n => {
    return n == 1
})

let t2 = [1, 2, 3].filter(n => {
    return n != 1
})


// gdzie pliki statyczne
app.use(express.static('static'))

app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
}));
app.set('view engine', 'hbs');                           // określenie nazwy silnika szablonów

// start
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})




