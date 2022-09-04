import "./style.css";
import { Drop, MousePos } from "./types";
import { createDrop, draw, getMousePos, onResize, stopHandling } from "./utils";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const rect = canvas.getBoundingClientRect();

const dropsInput = document.getElementById("drops") as HTMLInputElement;
const dropColorInput = document.getElementById(
  "drop-color"
) as HTMLInputElement;
const bgColorInput = document.getElementById("bg-color") as HTMLInputElement;

onResize(canvas);

const ctx = canvas.getContext("2d");

let particlesNum = Number(dropsInput.value) || 300;
let dropColor = dropColorInput.value;

let rainParticles: Drop[] = [];

let mousePos: MousePos = null;
let mousePress: boolean = false;

for (let i = 0; i < particlesNum; i++) {
  rainParticles.push(createDrop(canvas.width, canvas.height));
}

(function drawingLoop() {
  if (mousePress) {
    draw({
      particles: rainParticles,
      width: canvas.width,
      height: canvas.height,
      ctx,
      mousePos,
      dropColor,
    });
  } else {
    draw({
      particles: rainParticles,
      width: canvas.width,
      height: canvas.height,
      ctx,
      dropColor,
    });
  }

  // onResize(canvas);
  window.requestAnimationFrame(drawingLoop);
})();

function handleMouseDown(e: MouseEvent) {
  if (stopHandling(e)) return;

  mousePress = true;

  mousePos = getMousePos(e.clientX, e.clientY, rect);
}

function handleTouchStart(e: TouchEvent) {
  if (stopHandling(e)) return;

  mousePress = true;

  if (e.touches) {
    mousePos = getMousePos(e.touches[0].clientX, e.touches[0].clientY, rect);
  }
}

function handleMouseUp() {
  mousePress = false;
  mousePos = null;
}

function handleMouseMove(e: MouseEvent) {
  if (mousePress) {
    mousePos = getMousePos(e.clientX, e.clientY, rect);
  }
}

function handleTouchMove(e: TouchEvent) {
  if (mousePress && e.touches) {
    mousePos = getMousePos(e.touches[0].clientX, e.touches[0].clientY, rect);
    return;
  }
}

window.addEventListener("resize", () => onResize(canvas));

window.addEventListener("mousedown", handleMouseDown);
window.addEventListener("touchstart", handleTouchStart);

window.addEventListener("mouseup", handleMouseUp);
window.addEventListener("touchend", handleMouseUp);

window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("touchmove", handleTouchMove);

dropsInput.addEventListener("change", function (e: any) {
  particlesNum = Number(e.target.value);

  rainParticles = [];

  for (let i = 0; i < particlesNum; i++) {
    rainParticles.push(createDrop(canvas.width, canvas.height));
  }
});

dropColorInput.addEventListener("change", function (e: any) {
  dropColor = e.target.value;
});

bgColorInput.addEventListener("change", function (e: any) {
  document.getElementsByTagName("body")[0].style.backgroundColor =
    e.target.value;
});
