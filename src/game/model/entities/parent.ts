import { GameConfig } from "../../data/game-config";
import { GameActor } from "./game-actor";
import { GameEntity } from "./game-entity";

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

  public canCatch(entity: GameEntity): boolean {
    const centersDistance = entity
      .getPosition()
      .distanceTo(this.getPosition());
    const distance = centersDistance - this.getRadius() - entity.getRadius();
    return distance < GameConfig.CatchDistance;
  }
}
