import "./style.css";
import { Drop, MousePos } from "./types";
import { createDrop, draw, getmousePos } from "./utils";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const rect = canvas.getBoundingClientRect();

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

const maxParticles = 30;
let rainParticles: Drop[] = [];

let mousePos: MousePos = null;
let mousePress: boolean = false;

for (let i = 0; i < maxParticles; i++) {
  rainParticles.push(createDrop(width, height));
}

(function drawingLoop() {
  if (mousePress) {
    draw(rainParticles, width, height, ctx, mousePos);
  } else {
    draw(rainParticles, width, height, ctx);
  }

  window.requestAnimationFrame(drawingLoop);
})();

window.addEventListener("mousedown", function (e: MouseEvent) {
  mousePress = true;
  mousePos = getmousePos(e, rect);
});

window.addEventListener("mouseup", function () {
  mousePress = false;
  mousePos = null;
});

window.addEventListener("mousemove", function (e: MouseEvent) {
  if (mousePress) {
    mousePos = getmousePos(e, rect);
  }
});
