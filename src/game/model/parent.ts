import { MoveableEntity } from "./moveable-entity";

export class Parent extends MoveableEntity {
  public getAffectRadius(): number {
    return 0.25;
  }

  protected getRadius(): number {
    return 0.05;
  }
}
