import "./style.css";
import { Drop, MousePos } from "./types";
import { createDrop, draw, getmousePos } from "./utils";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const rect = canvas.getBoundingClientRect();

const hint = document.getElementById("hint") as HTMLDivElement;
const dropsInput = document.getElementById("drops") as HTMLInputElement;
const dropColorInput = document.getElementById(
  "drop-color"
) as HTMLInputElement;
const bgColorInput = document.getElementById("bg-color") as HTMLInputElement;

const sExpand = document.getElementById("s-expand") as HTMLDivElement;
const sCollapse = document.getElementById("s-collapse") as HTMLDivElement;
const settings = document.getElementById("settings") as HTMLDivElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

let particlesNum = Number(dropsInput.value) || 300;
let dropColor = dropColorInput.value;

let rainParticles: Drop[] = [];

let mousePos: MousePos = null;
let mousePress: boolean = false;

for (let i = 0; i < particlesNum; i++) {
  rainParticles.push(createDrop(width, height));
}

(function drawingLoop() {
  if (mousePress) {
    draw({ particles: rainParticles, width, height, ctx, mousePos, dropColor });
  } else {
    draw({ particles: rainParticles, width, height, ctx, dropColor });
  }

  window.requestAnimationFrame(drawingLoop);
})();

function handleMouseDown(e: any) {
  // @ts-ignore
  if (e.target.id === "settings") return;
  // @ts-ignore
  if (e.target.dataset["type"] === "setting-item") return;

  mousePress = true;
  mousePos = getmousePos(e, rect);
}

function handleMouseUp() {
  mousePress = false;
  mousePos = null;
}

function handleMouseMove(e: any) {
  if (mousePress) {
    mousePos = getmousePos(e, rect);
  }
}

window.addEventListener("mousedown", handleMouseDown);
window.addEventListener("touchstart", handleMouseDown);

window.addEventListener("mouseup", handleMouseUp);
window.addEventListener("touchend", handleMouseUp);

window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("touchmove", handleMouseMove);

hint.addEventListener("click", function () {
  this.style.display = "none";
});

dropsInput.addEventListener("change", function (e: any) {
  particlesNum = Number(e.target.value);

  rainParticles = [];

  for (let i = 0; i < particlesNum; i++) {
    rainParticles.push(createDrop(width, height));
  }
});

dropColorInput.addEventListener("change", function (e: any) {
  dropColor = e.target.value;
});

bgColorInput.addEventListener("change", function (e: any) {
  document.getElementsByTagName("body")[0].style.backgroundColor =
    e.target.value;
});

sExpand.addEventListener("click", function () {
  settings.style.display = "initial";
  sExpand.style.display = "none";
});

sCollapse.addEventListener("click", function () {
  settings.style.display = "none";
  sExpand.style.display = "initial";
});
