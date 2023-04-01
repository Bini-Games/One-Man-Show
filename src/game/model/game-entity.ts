import Matter from "matter-js";
import { Entity } from "../../core/components/entity";
import { Vector2 } from "../../core/math/vector2";

export class GameEntity extends Entity {
  protected body: Matter.Body = null;
  protected position: Vector2;

  public getPosition(): Vector2 {
    return this.position.copyFrom(this.body.position);
  }

  public setPosition(x: number, y: number): void {
    this.position.set(x, y);
    this.body.position = Matter.Vector.create(x, y);
  }

  public addToPhysicsWorld(world: Matter.World): void {
    Matter.World.addBody(world, this.body);
  }

  public init(): void {
    this.initBody();
  }

  protected initBody(): void {
    this.body = Matter.Bodies.circle(0, 0, this.getRadius(), {
      mass: this.getMass(),
      isStatic: this.isStatic(),
      restitution: this.getRestitution(),
    });
  }

  protected getRadius(): number {
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
