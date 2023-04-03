import { DisplayObject } from "pixi.js";
import { Entity } from "../../../core/components/entity";
import { Game } from "../../../core/facade/game";
import { Math2 } from "../../../core/math/math2";
import { Tween } from "@tweenjs/tween.js";

export class EntityAnimator {
  protected entity: Entity = null;
  protected view: DisplayObject = null;
  protected direction: number = -1;
  protected tween: Tween<DisplayObject> = null;
  protected animatingWalking: boolean = false;
  protected continueAnimating: boolean = false;

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

    this.animateWalking();
  }

  protected animateWalking(): void {
    if (this.animatingWalking) {
      this.continueAnimating = true;
    } else {
      this.animateWalkingOnce();
    }
  }

  protected animateWalkingOnce(): void {
    this.stopCurrentAnimation();

    this.animatingWalking = true;
    this.continueAnimating = false;

    const tween = new Tween(this.view);
      this.tween = tween;
      tween
        .to({
          angle: 10,
        }, 300)
        .start()
        .onComplete(() => {
          const tweenBack = new Tween(this.view);
          this.tween = tweenBack;
          tweenBack
            .to({
              angle: -10,
            }, 300)
            .start()
            .onComplete(() => this.onAnimatedWalkingOnce());
        });
  }

  protected onAnimatedWalkingOnce(): void {
    if (this.continueAnimating) {
      this.animateWalkingOnce();
    } else {
      this.animatingWalking = false;
      this.animateBackToIdle();
    }
  }

  protected animateBackToIdle(): void {
    this.stopCurrentAnimation();
    const tween = new Tween(this.view);
      this.tween = tween;
      tween
        .to({
          angle: 0,
        }, 300)
        .start();
  }

  protected stopCurrentAnimation(): void {
    this.tween && this.tween.stop();
    this.tween = null;
  }
}
