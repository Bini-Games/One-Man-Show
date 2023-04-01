import { GameConfig } from "../../data/game-config";
import { GameEntity } from "./game-entity";

export class Target extends GameEntity {
  public getRadius(): number {
    return 25 * GameConfig.UnitSize;
  }
}
