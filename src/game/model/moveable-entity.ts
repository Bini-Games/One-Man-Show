import * as Matter from "matter-js";
import { GameEntity } from "./game-entity";
import { Vector2, Vector2Pool } from "../../core/math/vector2";

export class MoveableEntity extends GameEntity {
  protected velocity: Vector2 = new Vector2();

  public getVelocity(): Vector2 {
    return this.velocity;
  }

  public setVelocity(x: number, y: number): void {
    this.velocity.set(x, y);
    this.updateBodyVelocity();
  }

  public resetVelocity(): void {
    this.setVelocity(0, 0);
  }

  public reset(): void {
    super.reset();
    this.resetVelocity();
  }

  public update(): void {
    this.updateBodyVelocity();
  }

  public destroy(): void {
    super.destroy();

    Vector2Pool.release(this.velocity);
    this.velocity = null;
  }

  protected updateBodyVelocity(): void {
    const velocity = this.velocity;
    Matter.Body.setVelocity(this.body, Matter.Vector.create(velocity.x, velocity.y));
  }
}
