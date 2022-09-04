export interface Drop {
  x: number;
  y: number;
  l: number;
  xs: number;
  ys: number;
}

export interface Position {
  x: number;
  y: number;
}

export type MousePos = Position | null;

export interface DrawParams {
  particles: Drop[];
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D | null;
  mousePos?: MousePos;
  dropColor?: string;
  mute?: boolean;
}
