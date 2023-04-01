import { Vector2 } from "../math/vector2";
import { Pool } from "./pool";

class Vector2PoolType extends Pool<Vector2> {
  constructor(startingCapacity?: number) {
    super(Vector2, startingCapacity);
  }
}

export const Vector2Pool = new Vector2PoolType(200);
