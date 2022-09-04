import "./style.css";
import { AUDIO_STATES, INCREMENT_STATES, MAX_PARTICLES } from "./constants";
import { Drop, MousePos } from "./types";
import { createDrop, draw, getMousePos, onResize, stopHandling } from "./utils";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const rect = canvas.getBoundingClientRect();

const dropsInput = document.getElementById("drops") as HTMLInputElement;
const dropColorInput = document.getElementById(
  "drop-color"
) as HTMLInputElement;
const bgColorInput = document.getElementById("bg-color") as HTMLInputElement;
const muteInput = document.getElementById("mute") as HTMLButtonElement;
const incrementInput = document.getElementById(
  "increment"
) as HTMLButtonElement;
const frequencyInput = document.getElementById("frequency") as HTMLInputElement;

onResize(canvas);

const ctx = canvas.getContext("2d");

let particlesNum = Number(dropsInput.value) || 300;
let dropColor = dropColorInput.value;
let rainParticles: Drop[] = [];
let mousePos: MousePos = null;
let mousePress: boolean = false;
let lastUpd = 0;

for (let i = 0; i < particlesNum; i++) {
  rainParticles.push(createDrop(canvas.width, canvas.height));
}

(function drawingLoop() {
  const mute = muteInput.value.toLowerCase() === AUDIO_STATES.MUTED;
  const incr = incrementInput.value.toLowerCase() === INCREMENT_STATES.AUTO;

  if (particlesNum > MAX_PARTICLES || particlesNum < 1) particlesNum = 10;

  if (incr && (!lastUpd || Date.now() - lastUpd >= 2 * 1000)) {
    lastUpd = Date.now();

    particlesNum++;

    dropsInput.value = `${particlesNum}`;

    rainParticles.push(createDrop(canvas.width, canvas.height));
  }

  if (mousePress) {
    draw({
      particles: rainParticles,
      width: canvas.width,
      height: canvas.height,
      ctx,
      mousePos,
      dropColor,
      mute,
      freq:
        Number(frequencyInput.value) > 1 ? Number(frequencyInput.value) : 200,
    });
  } else {
    draw({
      particles: rainParticles,
      width: canvas.width,
      height: canvas.height,
      ctx,
      dropColor,
      mute,
      freq:
        Number(frequencyInput.value) > 1 ? Number(frequencyInput.value) : 200,
    });
  }

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

muteInput.addEventListener("click", function () {
  const freqRow = frequencyInput.parentElement?.parentElement as HTMLElement;
  if (this.value.toLowerCase() === AUDIO_STATES.MUTED) {
    freqRow.style.display = "table-row";
    return (this.value = AUDIO_STATES.UNMUTED);
  }

  freqRow.style.display = "none";
  return (this.value = AUDIO_STATES.MUTED);
});

incrementInput.addEventListener("click", function () {
  if (this.value.toLowerCase() === INCREMENT_STATES.NONE)
    return (this.value = INCREMENT_STATES.AUTO);

  return (this.value = INCREMENT_STATES.NONE);
});
