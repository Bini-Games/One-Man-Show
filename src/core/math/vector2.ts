import * as assert from "typed-assert";
import { Vector2Pool } from "../pools/vector2-pool";
import { Math2 } from "./math2";
import { IVector2 } from "./vector2.interface";

export class Vector2 implements IVector2 {
  public static readonly zero: Vector2 = new Vector2();

  public x: number;
  public y: number;

  constructor(x?: number, y?: number) {
    if (x === undefined) {
      this.x = 0;
      this.y = 0;
    } else {
      assert.isNumber(x);
      this.x = x;

      if (y === undefined) {
        this.y = x;
      } else {
        assert.isNumber(y);
        this.y = y;
      }
    }
  }

  public set(x: number, y?: number): this {
    assert.isNumber(x);
    this.x = x;

    if (y === undefined) {
      this.y = x;
    } else {
      assert.isNumber(y);
      this.y = y;
    }

    return this;
  }

  public add(vector: IVector2): this {
    assert.isNotVoid(vector);

    this.x += vector.x;
    this.y += vector.y;

    return this;
  }

  public addScaled(vector: IVector2, scale: number): this {
    assert.isNotVoid(vector);
    assert.isNumber(scale);

    this.x += vector.x * scale;
    this.y += vector.y * scale;

    return this;
  }

  public addXY(x: number, y: number): this {
    assert.isNumber(x);
    assert.isNumber(y);

    this.x += x;
    this.y += y;

    return this;
  }

  public sub(vector: IVector2): this {
    assert.isNotVoid(vector);

    this.x -= vector.x;
    this.y -= vector.y;

    return this;
  }

  public subXY(x: number, y: number): this {
    assert.isNumber(x);
    assert.isNumber(y);

    this.x -= x;
    this.y -= y;

    return this;
  }

  public multiplyByScalar(factor: number): this {
    assert.isNumber(factor);

    this.x *= factor;
    this.y *= factor;

    return this;
  }

  public normalize(): this {
    const x = this.x;
    const y = this.y;

    if (x === 0 && y === 0) {
      this.x = 1;
    } else {
      const lenInv = 1 / Math.sqrt(x * x + y * y);
      this.x = x * lenInv;
      this.y = y * lenInv;
    }

    return this;
  }

  public getLength(): number {
    const x = this.x;
    const y = this.y;
    return Math.sqrt(x * x + y * y);
  }

  public setLength(length: number): this {
    assert.isNumber(length);

    const x = this.x;
    const y = this.y;

    if (x === 0 && y === 0) {
      this.x = length;
    } else {
      const lenInv = length / Math.sqrt(x * x + y * y);
      this.x = x * lenInv;
      this.y = y * lenInv;
    }

    return this;
  }

  public dot(vector: IVector2): number {
    assert.isNotVoid(vector);

    return this.x * vector.x + this.y * vector.y;
  }

  public distanceTo(vector: IVector2): number {
    assert.isNotVoid(vector);

    const dx = vector.x - this.x;
    const dy = vector.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public lerp(to: IVector2, t: number): this {
    assert.isNotVoid(to);
    assert.isNumber(t);

    this.x = Math2.lerp(this.x, to.x, t);
    this.y = Math2.lerp(this.y, to.y, t);

    return this;
  }

  public setFromPolar(radians: number, length: number): this {
    assert.isNumber(radians);
    assert.isNumber(length);

    this.x = Math.cos(radians) * length;
    this.y = Math.sin(radians) * length;

    return this;
  }

  public copyFrom(vector: IVector2): this {
    assert.isNotVoid(vector);

    this.x = vector.x;
    this.y = vector.y;

    return this;
  }

  public copyTo(vector: IVector2): this {
    assert.isNotVoid(vector);

    vector.x = this.x;
    vector.y = this.y;

    return this;
  }

  public equals(vector: IVector2): boolean {
    assert.isNotVoid(vector);

    return Math2.equal(this.x, vector.x) && Math2.equal(this.y, vector.y);
  }

  public clone(): Vector2 {
    return Vector2Pool.get().set(this.x, this.y);
  }
}
