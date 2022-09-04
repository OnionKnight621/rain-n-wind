import { DrawParams, Drop } from "./types";

let audioCtx: AudioContext | null = null;

export function draw({
  particles,
  width,
  height,
  ctx,
  mousePos,
  dropColor = "#41d3bd",
  mute,
  freq,
  type
}: DrawParams) {
  let xsMod = 0;
  let ysMod = 0;

  if (mousePos) {
    xsMod = (width / 2 - mousePos.x) * 0.02;
    ysMod = (height / 2 - mousePos.y) * 0.02;
  }

  if (ctx) {
    ctx.strokeStyle = dropColor; // "#fffff2"
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.l * p.xs + xsMod, p.y + p.l * p.ys + ysMod);
      ctx.stroke();
    }

    move(particles, width, height, xsMod, ysMod, mute, freq, type);
  }
}

export function move(
  particles: Drop[],
  width: number,
  height: number,
  xsMod: number = 0,
  ysMod: number = 0,
  mute = true,
  freq: number,
  type: OscillatorType
) {
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    p.x += p.xs + xsMod;
    p.y += p.ys + ysMod;

    if (p.x > width || p.y > height) {
      p.x = Math.random() * width;
      p.y = -20;

      if (i % 5 == 0 && i < 1000 && !mute) {
        notePlay(i / 5, freq, type);
      }
    }
  }
}

export function createDrop(
  width: number,
  height: number,
  xsMod: number = 1,
  ysMod: number = 8
): Drop {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    l: Math.random() * 1 + 0.5,
    xs: -1 + Math.random() * 1 + xsMod,
    ys: Math.random() * 10 + ysMod,
  };
}

export function getMousePos(x: number, y: number, rect: DOMRect) {
  return {
    x: x - rect.left,
    y: y - rect.top,
  };
}

export function stopHandling(e: MouseEvent | TouchEvent) {
  const target = e.target as HTMLElement;

  if (target.id === "settings") return true;
  if (target.dataset["type"] === "setting-item") return true;

  return false;
}

export function onResize(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

export function notePlay(i: number, freq: number, type: OscillatorType = "sine") {
  let dur = 0.3;

  if (audioCtx === null) {
    audioCtx = new AudioContext({ latencyHint: 2 });
  }

  let osc = audioCtx.createOscillator();
  let gainNode = audioCtx.createGain();

  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);

  osc.type = type;
  osc.frequency.value = (Math.random() * freq * (i + 1)) / 3;

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + dur);
}
