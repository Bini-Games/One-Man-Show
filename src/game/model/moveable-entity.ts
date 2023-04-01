import { GameEntity } from "./game-entity";
import { Vector2 } from "../../core/math/vector2";
import Matter from "matter-js";

export class MoveableEntity extends GameEntity {
  protected velocity: Vector2 = new Vector2();

  public getVelocity(): Vector2 {
    return this.velocity;
  }

  public setVelocity(x: number, y: number): void {
    this.velocity.set(x, y);
    Matter.Body.setVelocity(this.body, Matter.Vector.create(0, 0));
  }

  public resetVelocity(): void {
    this.setVelocity(0, 0);
  }
}
