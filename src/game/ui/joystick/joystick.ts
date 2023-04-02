import { Assets, Container, Sprite } from "pixi.js";
import { Vector2 } from "../../../core/math/vector2";
import { Signal } from "typed-signals";
import { Tween } from "@tweenjs/tween.js";
import { Easing } from "@tweenjs/tween.js";

export class Joystick extends Container {
  public readonly onChanged = new Signal()

  protected bg: Sprite = null;
  protected thumb: Sprite = null;
  protected downPosition: Vector2 = new Vector2();
  protected defaultPosition: Vector2 = new Vector2();
  protected radius = 150;
  protected releaseTween: Tween<unknown> = null;
  protected isActivated: boolean = false;

  public getRadius(): number {
    return this.radius;
  }

  public release(): void {
    this.thumb.position.set(0);
    this.animateRelease();
    this.isActivated = false;
    this.updateAlpha();
    this.onChanged.emit(0, 0);
  }

  public onStarted(x: number, y: number): void {
    this.stopAnimation();
    this.downPosition.set(x, y);
    this.position.set(x, y);
    this.isActivated = true;
    this.updateAlpha();
  }

  public onMove(x: number, y: number): void {
    const radius = this.radius;
    const downPosition = this.downPosition;
    const dx = x - downPosition.x;
    const dy = y - downPosition.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) {
      this.thumb.position.set(0, 0);
      this.onChanged.emit(0, 0);

      return;
    }

    const lengthInv = 1 / length;

    let nx = dx * lengthInv;
    let ny = dy * lengthInv;

    if (length < radius) {
      const coefficient = length / radius;

      nx *= coefficient;
      ny *= coefficient;
    }

    this.thumb.position.set(nx * radius, ny * radius);

    this.onChanged.emit(nx, ny);
  }

  public setDefaultPosition(x: number, y: number): void {
    this.stopAnimation();
    this.defaultPosition.set(x, y);
    this.position.set(x, y);
  }

  public init(): void {
    this.eventMode = "none";
    this.initBg();
    this.initThumb();
    this.updateAlpha();
  }

  protected initBg(): void {
    const bg = new Sprite(Assets.cache.get("joystick:bg"));
    this.bg = bg;
    this.addChild(bg);
    bg.anchor.set(0.5);
  }

  protected initThumb(): void {
    const thumb = new Sprite(Assets.cache.get("joystick:thumb"));
    this.thumb = thumb;
    this.addChild(thumb);
    thumb.anchor.set(0.5);
  }

  protected animateRelease() {
    const defaultPos = this.defaultPosition;

    const tween = new Tween(this.position)
      .to({
        x: defaultPos.x,
        y: defaultPos.y,
      }, 100)
      .easing(Easing.Sinusoidal.Out)
      .start();

    this.releaseTween = tween;
  }

  protected stopAnimation() {
    const tween = this.releaseTween;

    if (tween !== null) {
      this.releaseTween = null;

      tween.stop();
    }
  }

  protected updateAlpha(): void {
    this.alpha = this.isActivated ? 0.1 : 0.4;
  }
}
