import * as assert from "typed-assert";
import { IDestroyable } from "../abstractions/destroyable.interface";

export class MemoryUtils {
  private constructor() {
    assert.assert(false, "Static class.");
  }

  public static destroyMany(array: any[]): void {
    assert.isArray(array);

    const count = array.length;

    for (let i = 0; i < count; ++i) {
      const item = array[i] as IDestroyable;

      if (item && item.destroy) {
        item.destroy();
      }
    }
  }
}
