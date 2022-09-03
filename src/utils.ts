import { Drop, MousePos } from "./types";

export function draw(
  particles: Drop[],
  width: number,
  height: number,
  ctx: CanvasRenderingContext2D | null,
  mousePos: MousePos = null
) {
  let xsMod = 0;
  let ysMod = 0;

  if (mousePos) {
    xsMod = (width / 2 - mousePos.x) * 0.02;
    ysMod = (height / 2 - mousePos.y) * 0.02;
  }

  if (ctx) {
    ctx.strokeStyle = "#41d3bd"; // "#fffff2"
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

export function getmousePos(e: MouseEvent, rect: DOMRect) {
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}
