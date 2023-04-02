import { GameConfig } from "../../data/game-config";
import { GameActor } from "./game-actor";

export class Parent extends GameActor {
  public getDangerRadius(): number {
    return 150 * GameConfig.UnitSize;
  }

  public getRadius(): number {
    return 33 * GameConfig.UnitSize;
  }

  public getConditionChange(): number {
    return +2;
  }
}
