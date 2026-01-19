$(document).ready(function () {
    // DOM elements
    let plan = $("#plan")
    let rakieta = $("#rakieta")

    // buttons
    let steps = $("#steps")
    let jumping = $("#jumping")
    let fly = $("#fly")

    // zmienne
    let coords = []
    let divCounter = 0
    let stepsCounter = 0
    let jumpingBool = false
    let interval = ''

    // fly
    let start = true
    let startCoords, endCoords, currentCoords
    let finished = true
    let x, y
    let licznik = 0
    let vect, c, request
    let clicked = false
    // checkbox kierunek lotu
    let checkbox = $('#kierunek_lotu')

    plan.on("click", function (e) {
        // pobranie koordynatów kliknięcia
        let x = e.clientX - 80
        let y = e.clientY - 80

        // dodanie do tablicy koordynatów
        coords.push({ "x": x, "y": y })

        // dodanie i stylowanie div
        let div = $(`<div style='top:${y}px;left:${x}px' class='planeta' style='animation-name:;'><p>${divCounter}</p></div>`)

        // zwiększenie liczby w środku
        divCounter += 1

        // dodanie do body
        $("#main").append(div)

        // jeśli jest w trybie "fly", planety zacznął odrazu się obracać
        rotateDiv()


    })

    // ruch w krokach
    function move() {
        rakieta.css("top", coords[stepsCounter].y + 20)
        rakieta.css("left", coords[stepsCounter].x + 25)

        if (stepsCounter == coords.length - 1) {
            stepsCounter = 0
        }
        else {
            stepsCounter += 1
        }
    }


    steps.on("click", function () {
        move()
    })


    jumping.on("click", function () {
        if (jumpingBool) {
            clearInterval(interval)
            jumpingBool = false
        }
        else {
            interval = setInterval(move, 1000)
            jumpingBool = true
        }

    })

    function animateRocket() {
        if (clicked) {
            if (start) {
                if (finished) {
                    // wyzyskanie wartości top / left rakiety
                    x = rakieta.css("left")
                    y = rakieta.css("top")

                    x = String(x).slice(0, x.length - 2)
                    y = String(y).slice(0, y.length - 2)

                    // zapisanie do zmiennej
                    startCoords = { "x": x, "y": y }

                    // koordynaty do których dążymy
                    endCoords = coords[stepsCounter]

                    // zmieniamy kąt nachylenia rakiety

                    // wylicza kąt na podstrawie funkcji atan2
                    let kat = (Math.atan2(endCoords.y - startCoords.y, endCoords.x - startCoords.x) * 57.3)
                    rakieta.css("transform", `rotate(${Math.floor(kat + 90)}deg)`)

                    // ustawiamy proces jako nie skonczony ale rozpoczety
                    finished = false

                    // obliczamy wektor
                    // 
                    // a,b,c - boki trójkąta, z pitagorasa obliczamy c - odległość między punktami
                    let a = endCoords.y - startCoords.y
                    let b = endCoords.x - startCoords.x

                    c = Math.sqrt(a * a + b * b)


                    // wektor to boki wcześniej obliczonego trójkąta 
                    // (+20 aby rakieta kończyła na środku div'a)
                    // podzielone przez c, czyli jeśli powtóżymy przejście rakiety o c razy
                    // z użyciem wektora, dojdziemy do miejsca końcowego w "animowanym" stylu
                    vect = {
                        "x": (b + 20) / Math.floor(c) * 5,
                        "y": (a + 20) / Math.floor(c) * 5
                    }
                }
                else {
                    // wyzyskanie wartości top / left rakiety
                    x = rakieta.css("left")
                    y = rakieta.css("top")

                    x = parseFloat(String(x).slice(0, x.length - 2))
                    y = parseFloat(String(y).slice(0, y.length - 2))

                    // przesuwamy o wektor 
                    rakieta.css("left", x + parseFloat(vect.x) + "px")
                    rakieta.css("top", y + parseFloat(vect.y) + "px")

                    // dodajemy 1 do licznika
                    licznik += 1

                    // ukończenie procesu jeśli licznik dojdzie do wyznaczonej liczby (wektor)
                    if (licznik == Math.floor(c / 5)) {
                        licznik = 0
                        finished = true

                        // sprawdza czy checkbox 'kierunek lotu' jest zaznaczony
                        if (checkbox[0].checked) {
                            // jeśli tak to odwraca kierunek lotu
                            // czyli leci liczbami malejąco
                            if (stepsCounter == 0) {
                                stepsCounter = coords.length - 1
                            }
                            else {
                                stepsCounter -= 1
                            }
                        }
                        else {
                            // jeśli nie to leci liczbami rosnąco
                            if (stepsCounter == coords.length - 1) {
                                stepsCounter = 0
                            }
                            else {
                                stepsCounter += 1
                            }
                        }


                    }

                }
            }
        }
        else {





        }

        request = requestAnimationFrame(animateRocket)
        console.log("yes");
    }

    // funkcja obracająca divy o klasie .planeta
    function rotateDiv() {
        let divs = $(".planeta")
        if (clicked) {
            for (let i = 0; i < divs.length; i++) {
                divs[i].style.animationName = "obrotPlanet"
            }
        }
        else {
            for (let i = 0; i < divs.length; i++) {
                divs[i].style.animationName = ""
            }
        }

    }

    // kliknięcie przycisku fly
    fly.on("click", function () {
        // z buttona robimy switcha (on/off)
        if (clicked) {
            // jeśli klikniemy przyciks drugi raz:
            clicked = false


            // zerowanie liczników
            stepsCounter = 0
            licznik = 0

            // zakończenie przeskoku (z planety a do planety b)
            finished = true

            // wyłączenie animacji
            cancelAnimationFrame(request)
            rotateDiv()

            // powrót rakiety
            rakieta.css("top", "100px")
            rakieta.css("left", "800px")
            rakieta.css("transform", "")
        }
        else {
            // pierwsze kliknięcie
            clicked = true
            start = true

            // uruchomienie animacji
            animateRocket()
            rotateDiv()
        }

    })
})