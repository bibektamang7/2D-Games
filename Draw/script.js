    const colorPicker = document.getElementById("colorPicker"); 
const clearButton = document.getElementById("clear");
const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");
const penSize = document.getElementById("penSize");
// console.log(colorPicker.)

const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d", {willReadFrequently: true});

const WIDTH = 800;
const HEIGHT = 500;
let isClear = true;

let draw_color = "black";
let draw_width = "1";

const lineArray = [];
let currentIndex = -1;
const deletedLine = [];
let numberOfDeletedLine = -1;

canvas.width = WIDTH;
canvas.height = HEIGHT;

let isDrawing = false;

penSize.oninput = function () {
  draw_width = this.value;
}
colorPicker.oninput = function () {
  draw_color = this.value;
};

//This is clear event
clearButton.addEventListener("click", (e) => {
  if (currentIndex > -1 && !isClear) {
    console.log("xa hai")
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height)
    console.log(currentState)
    lineArray.push(currentState);
    currentIndex++;
    isClear = true;
  }
});

let trackClear = -1;
//This is undo event
undoButton.addEventListener("click", (e) => {
  if (currentIndex >= 0) {
    currentIndex--;

    const data = lineArray.pop();
    deletedLine.push(data);
    numberOfDeletedLine++;

    currentIndex < 0 ? ctx.clearRect(0, 0, WIDTH, HEIGHT) : ctx.putImageData(lineArray[currentIndex], 0, 0);
    if (isClear) {
      isClear = false;
      trackClear = numberOfDeletedLine;
    }
  }
});
redoButton.addEventListener("click", (e) => {
  if (numberOfDeletedLine >= 0) {
    if (numberOfDeletedLine === trackClear) {
      isClear = true;
    } 
    const previousLine = deletedLine.pop();
    numberOfDeletedLine--;
    lineArray.push(previousLine);
    currentIndex++;
    ctx.putImageData(previousLine, 0, 0);
  }
});

// This is drawing functionality
canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.strokeStyle = draw_color;
    ctx.lineWidth = draw_width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    isClear = false;
  }
  e.preventDefault();
});
// This is to close drawing event when mouse is unclicked
canvas.addEventListener("mouseup", (e) => {
  if (isDrawing) {
    isDrawing = false;
    ctx.stroke();
    ctx.closePath();
  }
  e.preventDefault();
  lineArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  currentIndex++;
});
// This is to close drawing 
canvas.addEventListener("mouseout", (e) => {
  if (isDrawing) {
    isDrawing = false;
  }
})

// This is to emit drawing when mouse is clicked
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  e.preventDefault();
});