import { Game } from "../facade/game";
import { ICloneable } from "../abstractions/cloneable.interface";

export class ArrayUtils {
  private constructor() {
    Game.logger.fail("Static class.");
  }

  public static fill<T>(value: T, count: number, destination?: T[]): T[] {
    const result = destination === undefined ? [] : destination;

    for (let i = 0; i < count; ++i) {
      result.push(value);
    }

    return result;
  }

  public static fillClone<T extends ICloneable<T>>(
    value: T,
    count: number,
    destination?: T[]
  ): T[] {
    const result = destination === undefined ? [] : destination;

    for (let i = 0; i < count; ++i) {
      result.push(value.clone());
    }

    return result;
  }
}
