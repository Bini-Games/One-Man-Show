import { DisplayObject } from "pixi.js";
import { Entity } from "../../../core/components/entity";
import { Game } from "../../../core/facade/game";
import { Math2 } from "../../../core/math/math2";

export class EntityAnimator {
  protected entity: Entity = null;
  protected view: DisplayObject = null;
  protected direction: number = -1;

  constructor(entity: Entity, view: DisplayObject) {
    this.entity = entity;
    this.view = view;
  }

  public init(): void {
    this.listenEvents();
  }

  protected listenEvents(): void {
    Game.events.on("gameplay:conscious_movement", this.onMovement, this);
  }

  protected onMovement(entity: Entity, x: number, y: number): void {
    if (entity !== this.entity) {
      return;
    }

    const direction = Math2.sign(x);

    if (direction !== this.direction) {
      this.direction = direction;
      this.view.scale.x *= -1;
    }
  }
}
