import { Game } from "../../../core/facade/game";
import { Math2 } from "../../../core/math/math2";
import { Vector2 } from "../../../core/math/vector2";
import { GameConfig } from "../../data/game-config";
import { MoveableEntity } from "./moveable-entity";
import { TargetType } from "./target-type.enum";

export class Target extends MoveableEntity {
  public readonly type: TargetType;

  protected defaultPosition: Vector2 = new Vector2();
  protected condition: number = GameConfig.NormalCondition;
  protected broken: boolean = false;

  constructor(type: TargetType) {
    super();

    this.type = type;
  }

  public getCondition(): number {
    return this.condition;
  }

  public isBroken(): boolean {
    return this.broken;
  }

  public affectCondition(change: number): void {
    this.condition = Math2.clamp(this.condition + change, 0, GameConfig.NormalCondition);

    const broken = this.condition === 0;
    const prevBroken = this.broken;

    if (broken !== prevBroken) {
      this.broken = broken;
      Game.events.emit("gameplay:target_broken_changed", this);
    }
  }

  public setDefaultPosition(x: number, y: number): void {
    this.defaultPosition.set(x, y);
  }

  public resetPositionToDefault(): void {
    const defaultPosition = this.defaultPosition;
    this.setPosition(defaultPosition.x, defaultPosition.y);
  }

  public reset(): void {
    super.reset();
    this.resetPositionToDefault();
  }

  public getRadius(): number {
    return 25 * GameConfig.UnitSize;
  }

  protected isSensor(): boolean {
    return true;
  }
}
