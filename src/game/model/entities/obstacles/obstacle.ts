import * as Matter from "matter-js";
import { GameEntity } from "../game-entity";
import { ObstacleType } from "./obstacle-type.enum";
import { BodyFactory } from "./body-factory";

export class Obstacle extends GameEntity {
  public readonly type: ObstacleType;

  protected bodyFactory: BodyFactory;

  constructor(type: ObstacleType, bodyFactory: BodyFactory) {
    super();

    this.type = type;
    this.bodyFactory = bodyFactory;
  }

  protected initBody(): void {
    const body = this.bodyFactory();
    this.body = body;
    Matter.Body.setVelocity(body, Matter.Vector.create(0, 0));
  }
}
