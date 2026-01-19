"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFileFunctions = void 0;
const loadFileFunctions = {
    selectAFileFunc() {
        console.log("fileSelect");
        // prompt user for a file
        const fileSelect = document.getElementById("fileSelect");
        // console.log("fileSelect here : ", fileSelect);
        fileSelect.click();
    },
    readFile(file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
            // restore game state from data
            loadFileFunctions.restoreData(reader.result);
        };
    },
    restoreData(rederRes) {
        return __awaiter(this, void 0, void 0, function* () {
            // here we try to get data, if json is invalid throw an error as an alert()
            let jsonRes;
            try {
                jsonRes = JSON.parse(rederRes);
            }
            catch (error) {
                // Handle the error gracefully
                console.error("Error parsing JSON:", error);
                jsonRes = false;
            }
            if (jsonRes) {
                console.log("we can restore");
                if (jsonRes.length > 0) {
                    // get unique images to load one by one
                    let uniqueImagesFound = [];
                    let canvasByImages = {};
                    jsonRes.forEach((element) => {
                        let leftPositionId = element.leftPositionId;
                        let rightPositionId = element.rightPositionId;
                        if (!uniqueImagesFound.includes(element.leftPositionId)) {
                            // add to unique
                            uniqueImagesFound.push(element.leftPositionId);
                            // add new obj to canvasByImages + value
                            canvasByImages[leftPositionId] = [rightPositionId];
                        }
                        else {
                            // add rightPositionId to existing canvasToLoad
                            canvasByImages[leftPositionId].push(rightPositionId);
                        }
                    });
                    // // clear all canvas on the right side
                    // for (let r = 0; r < gameData.rightPanelRows; r++) {
                    //     for (let c = 0; c < gameData.rightPanelCols; c++) {
                    //         const canvas = gameData.visibleRightPanelCanvas[r][c]
                    //         // clear background
                    //         const context = canvas.getContext('2d');
                    //         if (context) {
                    //             context.clearRect(0, 0, 48, 48);
                    //         }
                    //     }
                    // }
                    // // start loading images and placing them on board
                    // for (let i = 0; i < uniqueImagesFound.length; i++) {
                    //     const leftCanvasID = uniqueImagesFound[i];
                    //     // extract coordinates from id
                    //     const LCanvasCoordinates = loadFileFunctions.extractNumbersFromId(leftCanvasID, "left")
                    //     // copy image
                    //     const leftCanvasDOM = gameData.leftPanelCanvas[LCanvasCoordinates[0]][LCanvasCoordinates[1]][LCanvasCoordinates[2]] as HTMLCanvasElement
                    //     const rightCanvasArray = canvasByImages[leftCanvasID]
                    //     for (let n = 0; n < rightCanvasArray.length; n++) {
                    //         const rightCanvasID = rightCanvasArray[n];
                    //         // extract coordinates from id
                    //         const RCanvasCoordinates = loadFileFunctions.extractNumbersFromId(rightCanvasID, "right")
                    //         // copy / draw loaded image
                    //         const rightCanvasDOM = gameData.visibleRightPanelCanvas[RCanvasCoordinates[0]][RCanvasCoordinates[1]] as HTMLCanvasElement
                    //         const rightCanvasDOMCtx = rightCanvasDOM.getContext('2d');
                    //         rightCanvasDOMCtx.drawImage(leftCanvasDOM, 0, 0)
                    //     }
                    // }
                    // free space
                    // canvasByImages = null
                    // uniqueImagesFound = null
                    jsonRes = null;
                }
                else {
                    alert("empty json / no array");
                }
            }
            else {
                alert("damaged / invalid json file");
            }
        });
    },
    createFileSelect() {
        // Create an input element
        const fileSelect = document.createElement('input');
        fileSelect.type = 'file';
        // fileSelect.value = "load"
        fileSelect.accept = "application/json";
        fileSelect.id = "fileSelect";
        // Add an event listener to handle the file selection
        fileSelect.addEventListener('input', (event) => {
            const target = event.target;
            const files = target.files;
            if (files && files.length > 0) {
                const selectedFile = files[0];
                console.log('File selected:', selectedFile);
                // Handle the selected file (e.g., read it, upload it, etc.)
                this.readFile(selectedFile);
            }
            // clear the input velue so it triggers every time you upload ANY file (even the same one)
            target.value = "";
        });
        const body = document.getElementById("body");
        body.append(fileSelect);
    },
};
exports.loadFileFunctions = loadFileFunctions;
