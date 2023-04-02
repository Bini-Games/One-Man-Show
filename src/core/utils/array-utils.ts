import { Game } from "../facade/game";
import { ICloneable } from "../abstractions/cloneable.interface";

export class ArrayUtils {
  private constructor() {
    Game.logger.fail("Static class.");
  }

  public static random<T>(array: T[]): T {
    return array[~~(array.length * Math.random())];
  }
}
