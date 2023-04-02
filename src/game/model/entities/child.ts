import { GameConfig } from "../../data/game-config";
import { GameActor } from "./game-actor";

export class Child extends GameActor {
  public getRadius(): number {
    return 25 * GameConfig.UnitSize;
  }

  public getConditionChange(): number {
    return -2;
  }
}
