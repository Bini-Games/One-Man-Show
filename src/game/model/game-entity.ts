import * as Matter from "matter-js";
import { Entity } from "../../core/components/entity";
import { Vector2 } from "../../core/math/vector2";

export class GameEntity extends Entity {
  protected body: Matter.Body = null;
  protected position: Vector2 = new Vector2();

  public getPosition(): Vector2 {
    return this.position.copyFrom(this.body.position);
  }

  public setPosition(x: number, y: number): void {
    this.position.set(x, y);
    Matter.Body.setPosition(this.body, Matter.Vector.create(x, y));
  }

  public addToPhysicsWorld(world: Matter.World): void {
    Matter.World.addBody(world, this.body);
  }

  public reset(): void {}

  public init(): void {
    this.initBody();
  }

  protected initBody(): void {
    const body = Matter.Bodies.circle(0, 0, this.getRadius(), {
      mass: this.getMass(),
      isStatic: this.isStatic(),
      restitution: this.getRestitution(),
    });
    this.body = body;
    Matter.Body.setVelocity(body, Matter.Vector.create(0, 0));
  }

  public getRadius(): number {
    return 0.1;
  }

  protected getMass(): number {
    return 1;
  }

  protected isStatic(): boolean {
    return false;
  }

  protected getRestitution(): number {
    return 0;
  }
}
