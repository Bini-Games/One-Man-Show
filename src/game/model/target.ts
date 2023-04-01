import { GameEntity } from "./game-entity";

export class Target extends GameEntity {
  protected getRadius(): number {
    return 0.05;
  }
}
