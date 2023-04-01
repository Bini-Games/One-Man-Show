import { GameConfig } from "../../data/game-config";
import { MoveableEntity } from "./moveable-entity";

export class Parent extends MoveableEntity {
  public getAffectRadius(): number {
    return 125 * GameConfig.UnitSize;
  }

  public getRadius(): number {
    return 25 * GameConfig.UnitSize;
  }
}
