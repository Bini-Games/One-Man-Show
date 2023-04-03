import { Game } from "../facade/game";

export class Math2 {
  public static readonly EPS: number = 0.001;
  public static readonly EPS_N: number = -Math2.EPS;

  public static readonly PI: number = Math.PI;
  public static readonly PI2: number = Math2.PI * 2;

  public static readonly PI_1_2: number = Math2.PI / 2;
  public static readonly PI_1_3: number = Math2.PI / 3;
  public static readonly PI_1_4: number = Math2.PI / 4;
  public static readonly PI_1_6: number = Math2.PI / 6;
  public static readonly PI_2_3: number = (Math2.PI * 2) / 3;
  public static readonly PI_3_4: number = (Math2.PI * 3) / 4;

  public static readonly RAD2DEG: number = 180 / Math2.PI;
  public static readonly DEG2RAD: number = Math2.PI / 180;

  private constructor() {
    Game.logger.fail("Static class.");
  }

  public static abs(value: number): number {
    return value < 0 ? -value : value;
  }

  public static sign(value: number): number {
    return value < 0 ? -1 : 1;
  }

  public static min(a: number, b: number): number {
    return a < b ? a : b;
  }

  public static max(a: number, b: number): number {
    return a < b ? b : a;
  }

  public static clamp(x: number, min: number, max: number): number {
    return x < min ? min : x > max ? max : x;
  }

  public static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  public static unlerp(a: number, b: number, x: number): number {
    return (x - a) / (b - a);
  }

  public static equal(a: number, b: number): boolean {
    const diff = a - b;
    return diff < Math2.EPS && diff > Math2.EPS_N;
  }
}
