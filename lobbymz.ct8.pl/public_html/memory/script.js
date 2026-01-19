// czy czas jest ok czy trzeba na minuty???

// zmienne globalne
// 
// 
let winScreen
// kluczowe zmienne gry wykożystanie później
let odkryteKarty, ileKartMoznaOdkryc, first
// element wyświetlający czas
let timeLeftDiv

let stoperInterval, startTime, endTime, counter, time, divs
// główna plansza gry
let main

// kolejność zdjęć
let kolejnoscJPG, kolejnosc

let leaderBoardTable = document.getElementById("leaderBoard")

// testowanie wygranej
let winButton

// tabela wyników 
let tabela, leaderBoardButtons, leaderBoard
let on = true

// timeExpires for cookie
let timeExpires = new Date(Date.now() + 1000 * 60 * 60 * 5).toUTCString(); // +5h

// przypisanie do zmiennych dopiero po załadowaniu
window.addEventListener("load", function () {
    winScreen = document.getElementById("wygrana")
    timeLeftDiv = document.getElementById("timeLeft")
    main = document.getElementById("main")
    winButton = document.getElementById("winTestin")
})

function startGry(userTime) {
    // dodanie czasu
    let opis = document.getElementById("opis")
    opis.innerHTML += ` ${userTime}s`

    // ukrycie tabeli wyników
    tabela = document.getElementById("tabela")
    leaderBoardButtons = document.getElementById("leaderBoardButtons")
    leaderBoard = document.getElementById("leaderBoard")

    tabela.style.display = "none"
    leaderBoard.style.display = "none"
    leaderBoardButtons.style.display = "none"

    // usunięcie niepotrzebnych elementów
    while (leaderBoard.firstChild) {
        leaderBoard.removeChild(leaderBoard.firstChild);
    }
    while (leaderBoardButtons.firstChild) {
        leaderBoardButtons.removeChild(leaderBoardButtons.firstChild);
    }

    console.log("start-gry");
    // przygotowanie planszy
    // 
    // zmienne
    counter = 0
    // czas
    // 
    // wydobycie czasu
    let title = opis.innerHTML
    let time = title.slice(7, 9)

    // ustawia czas na począdku gry (aby nie było 00)
    timeLeftDiv.innerHTML = `00:${userTime}:000`

    // ukrycie i pokazanie odpowiednich elementów
    let tytul = document.getElementById("tytul")
    tytul.style.display = "none"

    let game = document.getElementById("game")
    game.style.display = "flex"

    // generowanie kart
    // 
    // 
    for (let i = 0; i < 4; i++) {
        // tworzy kolumny
        let col = document.createElement("div")
        col.className = "col"
        main.appendChild(col)
        for (let i = 0; i < 4; i++) {
            // w kolumnach po 4 div'y
            let div = document.createElement("div")
            div.className = "div"
            div.id = counter
            div.style.backgroundImage = "url('0.jpg')"
            col.appendChild(div)
            counter += 1
        }
    }

    // losowa mapa zdjec
    // 
    // zmienne
    kolejnosc = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]
    kolejnoscJPG = []

    // losowanie kolejności
    for (i = 0; i < kolejnosc.length; i++) {
        // zamiana losowego indexu na wartość ostatnią
        let randomNumber = Math.floor(Math.random() * 15)
        let numerToChange = kolejnosc.splice(randomNumber, 1)
        kolejnosc.push(numerToChange[0])
    }

    // dodanie do każdego elementu .jpg
    // teraz każdy element na stronie ospowiada indexowi w liście
    for (i = 0; i < kolejnosc.length; i++) {
        kolejnoscJPG[i] = kolejnosc[i] + ".jpg"
    }

    // karty
    // 
    // zmienne
    divs = document.getElementsByClassName("div")
    odkryteKarty = []
    ileKartMoznaOdkryc = 1
    first = true

    // odkrycie kart przy kliknięciu
    for (i = 0; i < kolejnosc.length; i++) {
        divs[i].addEventListener("click", odkrycie)
    }

}



// mierzenie czasu
function stoper() {
    // debugging

    // console.log(time);    
    // console.log(startTime);

    // aktualny czas
    let currentTime = new Date().getTime()

    // liczenie pozostałego czasu
    let timeLeft = -(currentTime - endTime)

    // zachowujemy OG string do sprawdzenia czy czas upłynął
    let timeLeft1 = timeLeft

    // console.log(timeLeft);

    // podział na s i mniejszą część
    timeLeft = String(timeLeft / 1000).split(".")

    // wyrównanie długości mniejszej części do 3
    if (timeLeft.length < 2) {
        console.log("nie ma części po przecinku");
        timeLeft[1] = "000"
        console.log(timeLeft);
    }
    else if (timeLeft[1].length < 3) {
        for (let i = timeLeft[1].length; i < 3; i++) {
            timeLeft[1] = "0" + timeLeft[1]
        }
    }

    // liczby ponizej 0
    // console.log(timeLeft[0]);
    if (parseInt(timeLeft[0]) < 10) {
        timeLeftDiv.innerHTML = `00:0${timeLeft[0]}:${timeLeft[1]}`
    }
    else {
        timeLeftDiv.innerHTML = `00:${timeLeft[0]}:${timeLeft[1]}`
    }

    // animacja czasu
    // 
    // wydobycie czasu
    time = document.getElementById("opis").innerHTML.split(" ")[1]
    time = time.slice(0, time.length - 1)


    let percent = timeLeft1 / time / 10

    let timeBarIn = document.getElementById("timeBarIn")

    timeBarIn.style.width = percent + "%"

    // sprawdzenie czy czas się skończył
    if (timeLeft1 <= 0) {
        console.log(currentTime);
        console.log(endTime);
        console.log("koniec czasu");
        timeLeftDiv.innerHTML = `00:00:00`
        let przegrana = document.getElementById("przegrana")
        przegrana.style.display = "flex"
        timeBarIn.style.display = "none"

        clearInterval(stoperInterval)
    }
}

// funkcja wywołana po kliknięciu w karte
function odkrycie() {
    let time
    // sprawdza czy pierwszy klik, jeśli tak odpala timer
    if (first) {
        // czas startu
        startTime = new Date().getTime()

        // wydobycie czasu
        time = document.getElementById("opis").innerHTML.split(" ")[1]
        time = time.slice(0, time.length - 1)
        console.log(time);

        // czas w którym ma się zakończyć
        endTime = startTime + time * 1000

        stoperInterval = setInterval(stoper, 11)
        first = false
    }

    // zapisanie id karty w zmiennej
    let id = this.id

    // sprawdza ile kart jest odkrytych (na począdku max 2)
    if (!(odkryteKarty.length > ileKartMoznaOdkryc)) {
        // zmienia zdjęcie karty z 0 na odpowiednik wylosowany wcześniej
        this.style.backgroundImage = "url(" + kolejnoscJPG[id] + ")"

        // dodaje do odkrytych kart id klikniętego div
        odkryteKarty.push(id)

        // sprawdza czy liczba odkrytych kart jest pażysta
        if (odkryteKarty.length % 2 == 0) {
            // jeśli jest to sprawdza czy klikamy 2x to samo
            if (odkryteKarty[odkryteKarty.length - 1] == odkryteKarty[odkryteKarty.length - 2]) {
                // wypisuje komunikat w logu
                console.log("nie klikamy 2 razy tego samego >:(");

                // teraz sprawdzimy czy użytkownik wcześniej odgadł / czy karty były odkryte
                let podwojnieKlikniety = odkryteKarty.length - 2
                let pierwszyIndex = odkryteKarty.indexOf(odkryteKarty[podwojnieKlikniety])

                if (pierwszyIndex == podwojnieKlikniety) {
                    console.log("wcześniej nie było cie na liście, zmieniam twoj img");
                    document.getElementById(odkryteKarty[podwojnieKlikniety]).style.backgroundImage = "url('0.jpg')"
                }
                else {
                    // nic nie robi bo użytkownik klika w odkrytą wcześniej karte
                    console.log("już raz odgadłeś to nikczemniku >:(");
                }
                // usunięcie z listy 2 ostatnio odkrytych elementów
                odkryteKarty.splice(odkryteKarty.length - 2, 2)

            }
            else {
                // sprawdza czy zdjecia klikniętych kart są takie same oraz czy id kart nie są takie same
                if (kolejnosc[odkryteKarty[odkryteKarty.length - 1]] == kolejnosc[odkryteKarty[odkryteKarty.length - 2]] && odkryteKarty[odkryteKarty.length - 1] != odkryteKarty[odkryteKarty.length - 2]) {
                    // wypisuje komunikat w logu
                    console.log("zgadłeś!");

                    // do ilości kart które można odkryć dodaje 2
                    ileKartMoznaOdkryc += 2

                    // usuwa EventListener z 2 ostatnio odkrytych kart
                    for (let i = 0; i < kolejnosc.length; i++) {
                        // sprawdza czy i jest w odkrytych kartach
                        for (let j = 0; j < odkryteKarty.length; j++) {
                            if (i == odkryteKarty[j]) {
                                console.log(i, "jest w odkrytych, usunę jego listener");
                                document.getElementById(i).removeEventListener("click", odkrycie)
                            }
                        }
                    }

                }
                else {
                    // usypia program na chwile aby dać użytkownikowi czas na zobaczenie odkrytych kart
                    console.log("karty nie mają tego samego zdj :(");
                    setTimeout(uspienie, 500)
                    for (i = 0; i < kolejnosc.length; i++) {
                        divs[i].removeEventListener("click", odkrycie)
                    }
                }
            }
            // ilość odkrytych kart jest pażysta, sprawdza czy użytkownik nie odkrył już wszystkich
            czyWygral()
        }
    }
    // jeśli użytkownik odkrył 2 karty i próbuje odkryć kolejne, przed "schowaniem" kart, wypisuje komunikat w logu
    else {
        console.log("więcej nie kilkaj >:(");
    }
}

// funkcja "chowa" 2 ostatnio odkryte karty i dodaje z powrotem eventListener'y
function uspienie() {
    // 2 ostatnie elementy z odkrytych kart
    let id1 = document.getElementById(odkryteKarty[odkryteKarty.length - 1])
    let id2 = document.getElementById(odkryteKarty[odkryteKarty.length - 2])

    // "chowa" karty
    id1.style.backgroundImage = "url('0.jpg')"
    id2.style.backgroundImage = "url('0.jpg')"

    // usunięcie z listy 2 ostatnio odkrytych elementów
    odkryteKarty.splice(odkryteKarty.length - 2, 2)

    // dodanie eventListenerów, chyba że karty są odkryte, do nich nie dodajemy Listenerów 
    // aby uniknąć problemów
    for (let i = 0; i < kolejnosc.length; i++) {
        let addListener = true
        // sprawdza czy i jest w odkrytych kartach
        for (let j = 0; j < odkryteKarty.length; j++) {
            if (i == odkryteKarty[j]) {
                console.log(i, "jest w odkrytych, nie dodaje listenera");
                addListener = false
            }
        }
        // jeśli nie ma dodaje do divaEvent z powrotem 
        if (addListener) {
            divs[i].addEventListener("click", odkrycie)
        }

    }

}

// srawdza czy użytkownik wygrał, jeśli tak to wyświetla ekran z informacją i buttonem
function czyWygral() {
    if (odkryteKarty.length == 16) {
        console.log("ez win");
        // wyłącza licznik oraz odkrywa ekran wygranej
        clearInterval(stoperInterval)
        winScreen.style.display = "flex"

        // zapisanie rekodru
        // 

        // chowa przycisk do kontynuacji
        let powrotList = document.getElementsByClassName("powrot")
        for (let i = 0; i < powrotList.length; i++) {
            let powrotButton = powrotList[i]
            powrotButton.style.display = "none"
        }

    }
    else {
        console.log("jeszcze nie wygrał", odkryteKarty.length);
    }
}

// pobiera od urzytkownika nick i czas w jakim ukonczyl
function getNick() {
    // czyszczenie/usuwanie cookie
    // document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });

    console.log("cookie przed modyfikacją");
    console.log(document.cookie);

    // jeśli nie ma cookie dodaje counter
    if (document.cookie == "undefined" || document.cookie == "" || document.cookie == " ") {
        console.log("counter na 0");
        document.cookie = "counter=0" + ";expires=" + timeExpires
    }

    // pobiera counter z cookie
    let cookieList = document.cookie.split(";")
    console.log(cookieList);
    let userCounter

    if (cookieList.length < 2) {
        userCounter = document.cookie.split("=")[1]
    }
    else {
        // odnajduje cookieCounter w zapisanych cookie
        for (let i = 0; i < cookieList.length; i++) {
            if (cookieList[i].trim().startsWith("counter")) {
                userCounter = cookieList[i].split("=")[1]
            }
        }
    }

    // wydobycie czasu
    time = document.getElementById("opis").innerHTML.split(" ")[1]
    time = time.slice(0, time.length - 1)

    // dodaje urzytkownika do cookie
    let nick = document.getElementById("nick")
    if (nick.value.length <= 1) {
        document.cookie = `user${userCounter}=anonim,${timeLeftDiv.innerHTML},${time}` + ";expires=" + timeExpires
    }
    else {
        document.cookie = `user${userCounter}=` + encodeURIComponent(nick.value) + `,${timeLeftDiv.innerHTML},${time}` + ";expires=" + timeExpires
    }

    console.log(userCounter);

    // zwiększa userCounter
    userCounter++

    // podmienia counter w cookie
    document.cookie = `counter=${userCounter}` + ";expires=" + timeExpires

    console.log("cookie po procesie");
    console.log(document.cookie);

    // po pobraniu nicku pokazuje przycisk do kontynuacji
    let powrotList = document.getElementsByClassName("powrot")
    for (let i = 0; i < powrotList.length; i++) {
        let powrotButton = powrotList[i]
        powrotButton.style.display = "flex"

        nick.style.display = "none"

    }

    // chowa button do przekazania nicku
    let nickButton = document.getElementById("nickButton")
    nickButton.style.display = "none"


}

function resetGry(state) {
    if (state == "win") {
        // przywrócenie pierwotnego układu przycisków pobierających nick
        let nick = document.getElementById("nick")
        nick.style.display = "block"
        nick.value = ""

        // pokazuje button do przekazania nicku
        let nickButton = document.getElementById("nickButton")
        nickButton.style.display = "block"
    }
    else {
        console.log("lose");
        // schowanie ekranu przegranej
        let przegrana = document.getElementById("przegrana")
        przegrana.style.display = "none"
    }

    // wypełnienie time bar'a
    let timeBarIn = document.getElementById("timeBarIn")
    timeBarIn.style.width = "100%"
    timeBarIn.style.display = "block"

    // chowanie elementów
    winScreen.style.display = "none"
    document.getElementById("game").style.display = "none"

    // pokazanie elementów
    tytul.style.display = "block"

    // przygotowanie elementów pod następną gre
    let opis = document.getElementById("opis")
    opis.innerHTML = "Memory"

    // usunięcie niepotrzebnych elementów
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }

    // pokazanie tabeli wyników
    let tabela = document.getElementById("tabela")
    tabela.style.display = "flex"

    // naprawienie buttona z leaderboard
    on = true

    // zmiana tekstu
    let showLeaderBoardButton = document.getElementById("showLeaderBoardButton")

    showLeaderBoardButton.innerHTML = "showLeaderBoard"

}

function winTestin() {
    odkryteKarty.length = 16
    czyWygral()
}

function showLeaderBoard() {
    if (on) {
        // zrobienie swicha on/off
        on = false

        // usunięcie niepotrzebnych elementów
        let leaderBoardButtonsDOM = document.getElementById("leaderBoardButtons")
        let leaderBoardDOM = document.getElementById("leaderBoard")

        while (leaderBoardDOM.firstChild) {
            leaderBoardDOM.removeChild(leaderBoardDOM.firstChild);
        }
        while (leaderBoardButtonsDOM.firstChild) {
            leaderBoardButtonsDOM.removeChild(leaderBoardButtonsDOM.firstChild);
        }

        // zmienne
        let leaderBoardTable = document.getElementById("leaderBoard")
        let dataList = []

        // lista ciasteczek
        let ciasteczka = document.cookie.split(";")

        if (ciasteczka.length > 1) {
            // usunięcie countera
            for (let i = 0; i < ciasteczka.length; i++) {
                if (ciasteczka[i].split("=")[0].trim() == "counter") {
                    let index = ciasteczka.indexOf(ciasteczka[i])
                    ciasteczka.splice(index, 1)
                }
            }

            // unikatowe tryby
            let uniqueModes = []

            // zrobienie listy 
            //  - unikatowych trybów
            //  - pomieszanych czasów i trybów
            for (let i = 0; i < ciasteczka.length; i++) {
                let userData = ciasteczka[i].split("=")

                let userId = userData[0].trim().slice(4)

                let userDetails = userData[1].split(",")

                let userNick = decodeURIComponent(userDetails[0])
                let userTime = userDetails[1]
                let userMode = userDetails[2]

                // modyfikacja czasu na liczbę którą da się porównać
                userTime = userTime.slice(3)
                userTime = userTime.replace(":", ".")
                userTime = parseFloat(userTime)

                dataList.push([userId, userNick, userTime, userMode])

                if (!(uniqueModes.includes(userMode))) {
                    uniqueModes.push(userMode)
                }
            }

            let leaderBoard = []
            // przygotowanie leaderboard
            for (let j = 0; j < uniqueModes.length; j++) {
                leaderBoard.push([uniqueModes[j]])
            }
            for (let i = 0; i < dataList.length; i++) {
                for (let j = 0; j < uniqueModes.length; j++) {
                    if (dataList[i][3] == uniqueModes[j]) {
                        leaderBoard[j].push(dataList[i])
                    }
                }
            }

            // sortowanko
            for (let i = 0; i < leaderBoard.length; i++) {
                sortowanieCiastek(leaderBoard[i])
                // console.log(leaderBoard[i]);
            }

            // tworzenie leaderBoard

            let th = document.createElement("th")

            for (let i = 0; i < uniqueModes.length; i++) {
                // 
                let tableData
                for (let j = 0; j < leaderBoard.length; j++) {
                    // console.log(leaderBoard[j]);
                    if (leaderBoard[i][0] == uniqueModes[i]) {
                        tableData = leaderBoard[i]
                    }
                }

                // buttony trybów
                let modeButton = document.createElement("button")

                modeButton.innerHTML = uniqueModes[i]
                modeButton.addEventListener("click", function () {
                    modeLeaderBoard(uniqueModes[i], tableData)
                })
                th.append(modeButton)
            }

            let leaderBoardButtons = document.getElementById("leaderBoardButtons")
            leaderBoardButtons.append(th)

            // opisy
            let descList = ["Pozycja", "Numer gry", "Nick", "Czas [s]", "Tryb Gry"]
            let thDesc = document.createElement("th")
            for (let j = 0; j < 5; j++) {
                // dodanie opisow
                let tdDesc = document.createElement('td')
                tdDesc.innerHTML = descList[j]
                tdDesc.className = "opisyLeaderboard"
                thDesc.append(tdDesc)
            }
            leaderBoardTable.append(thDesc)
        }
        else {
            console.log("ale tu nie ma ciasteczek :(");
        }

        // pokazanie tabeli wyników
        let tabela = document.getElementById("tabela")
        let leaderBoardButtons = document.getElementById("leaderBoardButtons")
        let leaderBoard = document.getElementById("leaderBoard")

        tabela.style.display = "flex"
        leaderBoard.style.display = "flex"
        leaderBoardButtons.style.display = "flex"

        // zmiana tekstu
        let showLeaderBoardButton = document.getElementById("showLeaderBoardButton")

        showLeaderBoardButton.innerHTML = "hideLeaderBoard"
    }
    else {
        // chowanie tabeli wyników
        on = true

        // ukrycie tabeli wyników
        leaderBoardButtons = document.getElementById("leaderBoardButtons")
        leaderBoard = document.getElementById("leaderBoard")

        leaderBoard.style.display = "none"
        leaderBoardButtons.style.display = "none"

        // zmiana tekstu
        let showLeaderBoardButton = document.getElementById("showLeaderBoardButton")

        showLeaderBoardButton.innerHTML = "showLeaderBoard"
    }


}

function modeLeaderBoard(time, tableData) {
    let leaderBoardTable = document.getElementById("leaderBoard")

    // usunięcie dzieci jeśli są
    if (leaderBoardTable.childNodes.length > 1) {
        console.log("więcej niż jedno dziecko");

        // usunięcie wszystkich dzieci oprocz buttonów (th)
        let trs = document.getElementsByClassName("tr")
        for (let i = trs.length - 1; i >= 0; i--) {
            console.log(trs[i]);
            trs[i].remove()
        }
    }

    console.log("jedno dziecko");
    // dodanie wyników
    // 
    // unsunięcie czasu z tableData
    console.log(tableData);
    for (let j = 0; j < tableData.length; j++) {
        console.log(j);
        if (tableData[j].length < 4) {
            tableData.shift()
        }
    }

    // dodanie pozycji w osobnej pętli, bo zmiana length
    for (let j = 0; j < tableData.length; j++) {
        if (tableData[j].length < 5) {
            tableData[j].unshift(j + 1)
        }
        else {
            console.log("log pozycja już była");
        }
    }

    // dodanie danych do tabeli
    for (let i = 0; i < tableData.length; i++) {
        console.log(i);
        if (i == 10) {
            break
        }
        let tr = document.createElement("tr")
        tr.className = "tr"
        for (let j = 0; j < tableData[i].length; j++) {
            let td = document.createElement("td")
            td.innerHTML = tableData[i][j]

            tr.append(td)
        }
        leaderBoardTable.append(tr)
    }
}

function sortowanieCiastek(lista) {
    // sprawdzenie czy większy niż poprzednio dodany (sortowanie)
    // 
    // sortowanko
    for (let k = 0; k < lista.length - 1; k++) {
        if (lista[k].length > 1) {
            for (let j = 0; j < lista.length - 1; j++) {
                let time1 = lista[j][2]
                let time2 = lista[j + 1][2]

                if (time2 > time1) {
                    let tmp = lista[j]
                    lista[j] = lista[j + 1]
                    lista[j + 1] = tmp
                }
            }
        }

    }

}

