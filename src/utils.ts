import { DrawParams, Drop } from "./types";

export function draw({
  particles,
  width,
  height,
  ctx,
  mousePos,
  dropColor = "#41d3bd",
}: DrawParams) {
  let xsMod = 0;
  let ysMod = 0;

  if (mousePos) {
    xsMod = (width / 2 - mousePos.x) * 0.02;
    ysMod = (height / 2 - mousePos.y) * 0.02;
  }

  if (ctx) {
    ctx.strokeStyle = dropColor; // "#fffff2"
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.l * p.xs + xsMod, p.y + p.l * p.ys + ysMod);
      ctx.stroke();
    }

    move(particles, width, height, xsMod, ysMod);
  }
}

export function move(
  particles: Drop[],
  width: number,
  height: number,
  xsMod: number = 0,
  ysMod: number = 0
) {
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    p.x += p.xs + xsMod;
    p.y += p.ys + ysMod;

    if (p.x > width || p.y > height) {
      p.x = Math.random() * width;
      p.y = -20;
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

export function onResize(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
