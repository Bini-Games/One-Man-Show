import * as assert from "typed-assert";
import { Pool } from "./pool";
import { Math2 } from "./math2";
import { ISize } from "./size.interface";
import { Vector2, Vector2Pool } from "./vector2";
import { IVector2 } from "./vector2.interface";

export class Bounds implements ISize {
  protected _minX: number;
  protected _minY: number;
  protected _maxX: number;
  protected _maxY: number;

  constructor(minX?: number, minY?: number, maxX?: number, maxY?: number) {
    if (minX === undefined) {
      this._minX = Infinity;
      this._minY = Infinity;
      this._maxX = -Infinity;
      this._maxY = -Infinity;
    } else {
      assert.isNumber(minX);
      assert.isNumber(minY);
      assert.isNumber(maxX);
      assert.isNumber(maxY);

      this._minX = minX;
      this._minY = minY;
      this._maxX = maxX;
      this._maxY = maxY;
    }
  }

  public get minX(): number {
    return this._minX;
  }

  public get minY(): number {
    return this._minY;
  }

  public get maxX(): number {
    return this._maxX;
  }

  public get maxY(): number {
    return this._maxY;
  }

  public get width(): number {
    return this._maxX - this._minX;
  }

  public get height(): number {
    return this._maxY - this._minY;
  }

  public set width(value: number) {
    assert.isNumber(value);

    this._maxX = this._minX + value;
  }

  public set height(value: number) {
    assert.isNumber(value);

    this._maxY = this._minY + value;
  }

  public get centerX(): number {
    return (this._minX + this._maxX) * 0.5;
  }

  public get centerY(): number {
    return (this._minY + this._maxY) * 0.5;
  }

  public get position(): Vector2 {
    return Vector2Pool.get().set(this._minX, this._minY);
  }

  public set position(vec: Vector2) {
    assert.isNotVoid(vec);

    const minX = this._minX;
    const minY = this._minY;
    const maxX = this._maxX;
    const maxY = this._maxY;

    const offsetX = vec.x - minX;
    const offsetY = vec.y - minY;

    this._minX = minX + offsetX;
    this._maxX = maxX + offsetX;
    this._minY = minY + offsetY;
    this._maxY = maxY + offsetY;
  }

  public get center(): Vector2 {
    return Vector2Pool.get().set(
      (this._minX + this._maxX) * 0.5,
      (this._minY + this._maxY) * 0.5
    );
  }

  public containsXY(x: number, y: number): boolean {
    assert.isNumber(x);
    assert.isNumber(y);

    return (
      x >= this._minX && x <= this._maxX && y >= this._minY && y <= this._maxY
    );
  }

  public contains(vec: IVector2): boolean {
    assert.isNotVoid(vec);

    const x = vec.x;
    const y = vec.y;

    return (
      x >= this._minX && x <= this._maxX && y >= this._minY && y <= this._maxY
    );
  }

  public containsBounds(bounds: Bounds): boolean {
    assert.isNotVoid(bounds);

    return !(
      this._minX > bounds._minX ||
      this._maxX < bounds._maxX ||
      this._minY > bounds._minY ||
      this._maxY < bounds._maxY
    );
  }

  public intersects(bounds: Bounds): boolean {
    assert.isNotVoid(bounds);

    return !(
      bounds._minX > this._maxX ||
      bounds._maxX < this._minX ||
      bounds._minY > this._maxY ||
      bounds._maxY < this._minY
    );
  }

  public intersectsRaw(
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
  ): boolean {
    assert.isNumber(minX);
    assert.isNumber(minY);
    assert.isNumber(maxX);
    assert.isNumber(maxY);

    return !(
      minX > this._maxX ||
      maxX < this._minX ||
      minY > this._maxY ||
      maxY < this._minY
    );
  }

  public intersection(bounds: Bounds, destination?: Bounds): Bounds {
    assert.isNotVoid(bounds);

    const result = destination === undefined ? BoundsPool.get() : destination;
    result._minX = Math2.max(this._minX, bounds._minX);
    result._maxX = Math2.min(this._maxX, bounds._maxX);
    result._minY = Math2.max(this._minY, bounds._minY);
    result._maxY = Math2.min(this._maxY, bounds._maxY);
    return result;
  }

  public translate(x: number, y: number): this {
    assert.isNumber(x);
    assert.isNumber(y);

    this._minX += x;
    this._minY += y;
    this._maxX += x;
    this._maxY += y;

    return this;
  }

  public scale(factor: number): this {
    assert.isNumber(factor);

    this._minX *= factor;
    this._minY *= factor;
    this._maxX *= factor;
    this._maxY *= factor;

    return this;
  }

  public set(minX: number, minY: number, maxX: number, maxY: number): this {
    assert.isNumber(minX);
    assert.isNumber(minY);
    assert.isNumber(maxX);
    assert.isNumber(maxY);

    this._minX = minX;
    this._minY = minY;
    this._maxX = maxX;
    this._maxY = maxY;

    return this;
  }

  public reset(): this {
    this._minX = Infinity;
    this._minY = Infinity;
    this._maxX = -Infinity;
    this._maxY = -Infinity;

    return this;
  }

  public isReset(): boolean {
    return this._minX > this._maxX || this._minY > this._maxY;
  }

  public copyFrom(bounds: Bounds): this {
    assert.isNotVoid(bounds);

    this._minX = bounds._minX;
    this._minY = bounds._minY;
    this._maxX = bounds._maxX;
    this._maxY = bounds._maxY;

    return this;
  }

  public copyTo(bounds: Bounds): this {
    assert.isNotVoid(bounds);

    bounds._minX = this._minX;
    bounds._minY = this._minY;
    bounds._maxX = this._maxX;
    bounds._maxY = this._maxY;

    return this;
  }

  public clone(): Bounds {
    return BoundsPool.get().copyFrom(this);
  }

  public equals(bounds: Bounds): boolean {
    assert.isNotVoid(bounds);

    return (
      this._minX === bounds._minX &&
      this._minY === bounds._minY &&
      this._maxX === bounds._maxX &&
      this._maxY === bounds._maxY
    );
  }

  public equalsEps(bounds: Bounds, eps: number): boolean {
    assert.isNotVoid(bounds);
    assert.isNumber(eps);

    return (
      Math2.abs(this._minX - bounds._minX) <= eps &&
      Math2.abs(this._minY - bounds._minY) <= eps &&
      Math2.abs(this._maxX - bounds._maxX) <= eps &&
      Math2.abs(this._maxY - bounds._maxY) <= eps
    );
  }

  public addBounds(bounds: Bounds): this {
    assert.isNotVoid(bounds);

    this._minX = Math2.min(this._minX, bounds._minX);
    this._minY = Math2.min(this._minY, bounds._minY);
    this._maxX = Math2.max(this._maxX, bounds._maxX);
    this._maxY = Math2.max(this._maxY, bounds._maxY);

    return this;
  }

  public addVec(vec: IVector2): this {
    assert.isNotVoid(vec);

    const x = vec.x;
    const y = vec.y;

    this._minX = Math2.min(this._minX, x);
    this._minY = Math2.min(this._minY, y);
    this._maxX = Math2.max(this._maxX, x);
    this._maxY = Math2.max(this._maxY, y);

    return this;
  }

  public clampVec<V extends IVector2 = Vector2>(
    vec: IVector2,
    destination?: V
  ): V {
    assert.isNotVoid(vec);

    const result = destination === undefined ? Vector2Pool.get() : destination;
    result.x = Math2.max(this._minX, Math2.min(this._maxX, vec.x));
    result.y = Math2.max(this._minY, Math2.min(this._maxY, vec.y));
    return result as V;
  }

  public roundUp(): this {
    this._minX = Math.floor(this._minX);
    this._minY = Math.floor(this._minY);
    this._maxX = Math.ceil(this._maxX);
    this._maxY = Math.ceil(this._maxY);

    return this;
  }

  public toString(): string {
    return `(${this._minX};${this._minY}) (${this._maxX};${this._maxY})`;
  }

  public hash(): number {
    return ~~(
      this._minX * this._minY +
      this._maxX * this._maxY +
      this._minX +
      this._minY +
      this._maxX +
      this._maxY
    );
  }

  public static fromPoints(points: IVector2[], destination?: Bounds): Bounds {
    assert.isArray(points);

    const result = destination === undefined ? BoundsPool.get() : destination;
    const count = points.length;

    for (let i = 0; i < count; ++i) {
      result.addVec(points[i]);
    }

    return result;
  }
}

class BoundsPoolType extends Pool<Bounds> {
  constructor(startingCapacity?: number) {
    super(Bounds, startingCapacity);
  }
}

export const BoundsPool = new BoundsPoolType(20);

