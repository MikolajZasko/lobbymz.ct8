"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loadFile_1 = require("./loadFile");
const giantCanvas_1 = require("./giantCanvas");
document.addEventListener("DOMContentLoaded", function () {
    console.log("sas");
    // create big ass canvas
    const giantCanvasClass = new giantCanvas_1.giantCanvas(25, 25);
    giantCanvasClass.createHTML();
    // create file select (for loading files)
    loadFile_1.loadFileFunctions.createFileSelect();
});
