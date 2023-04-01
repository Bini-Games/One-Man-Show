import { GameConfig } from "../data/game-config";
import { MoveableEntity } from "./moveable-entity";

export class Parent extends MoveableEntity {
  public getAffectRadius(): number {
    return 0.25 * GameConfig.MLScale;
  }

  public getRadius(): number {
    return 0.05 * GameConfig.MLScale;
  }
}
