import * as assert from "typed-assert";

export class Pool<T> {
  protected pool: T[];
  protected itemConstructor: new () => T;

  constructor(itemConstructor: new () => T, startingCapacity: number = 10) {
    this.itemConstructor = itemConstructor;
    this.pool = [];
    this.populate(startingCapacity);
  }

  public release(item: T): void {
    assert.isNotVoid(item);
    this.pool.push(item);
  }

  public releaseMany(items: T[]): void {
    assert.isArray(items);

    const pool = this.pool;
    const length = items.length;

    for (let i = 0; i < length; ++i) {
      pool.push(items[i]);
    }
  }

  public get(): T {
    return this.pool.pop() || this.createItem();
  }

  public getMany(amount: number, destination?: T[]): T[] {
    const result = destination === undefined ? [] : destination;

    for (let i = 0; i < amount; ++i) {
      result.push(this.get());
    }

    return result;
  }

  public populate(amount: number): void {
    assert.isNumber(amount);

    for (let i = 0; i < amount; ++i) {
      this.release(this.createItem());
    }
  }

  protected createItem(): T {
    return new this.itemConstructor();
  }
}
