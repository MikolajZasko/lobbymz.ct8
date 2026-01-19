import { allEvents } from "./src/modules/Ui"
import { GameObject } from "./src/modules/Main"

// button listeners
allEvents.init()

// helper axes
GameObject.axes()

// board generation
GameObject.szachownica()

// three js render
GameObject.render()
