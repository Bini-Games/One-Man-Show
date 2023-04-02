import { GameConfig } from "../../data/game-config";
import { MoveableEntity } from "./moveable-entity";

export class Parent extends MoveableEntity {
  public getAffectRadius(): number {
    return 150 * GameConfig.UnitSize;
  }

  public getRadius(): number {
    return 33 * GameConfig.UnitSize;
  }
}
