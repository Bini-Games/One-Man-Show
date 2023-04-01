import { GameEntity } from "./game-entity";

export class Target extends GameEntity {
  public getRadius(): number {
    return 0.05;
  }
}
