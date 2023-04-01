import { Bounds } from "../math/bounds";
import { Pool } from "./pool";

class BoundsPoolType extends Pool<Bounds> {
  constructor(startingCapacity?: number) {
    super(Bounds, startingCapacity);
  }
}

export const BoundsPool = new BoundsPoolType(20);
