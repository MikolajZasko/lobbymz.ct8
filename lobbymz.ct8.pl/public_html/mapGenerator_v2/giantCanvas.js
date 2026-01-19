"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.giantCanvas = void 0;
class giantCanvas {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
    }
    createHTML() {
        console.log("createHTML");
        // calculate height / width
        const canvas = document.createElement("canvas");
        canvas.width = this.columns * 48;
        canvas.height = this.rows * 48;
        canvas.id = "bigCanvas";
        document.body.append(canvas);
        // for (let c = 0; c < this.columns; c++) {
        //     for (let r = 0; r < this.rows; r++) {
        //     }
        // }
    }
}
exports.giantCanvas = giantCanvas;
