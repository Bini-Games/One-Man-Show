import { GameConfig } from "../data/game-config";
import { MoveableEntity } from "./moveable-entity";

export class Child extends MoveableEntity {
  public getRadius(): number {
    return 25 * GameConfig.UnitSize;
  }
}
