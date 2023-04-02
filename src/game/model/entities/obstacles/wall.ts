import { ObstacleType } from "./obstacle-type.enum";
import { BodyFactory } from "./body-factory";
import { Obstacle } from "./obstacle";

export class Wall extends Obstacle {
  protected width: number;
  protected height: number;

  constructor(width: number, height: number, bodyFactory: BodyFactory) {
    super(ObstacleType.Wall, bodyFactory);

    this.width = width;
    this.height = height;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }
}
