import { MoveableEntity } from "./moveable-entity";

export class Child extends MoveableEntity {
  public getRadius(): number {
    return 0.05;
  }
}
