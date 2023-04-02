import { Assets, Container, FederatedPointerEvent, Sprite } from "pixi.js";
import { Joystick } from "./joystick/joystick";
import { Game } from "../../core/facade/game";
import { Math2 } from "../../core/math/math2";

export class UI extends Container {
  protected overlay: Sprite = null;
  protected joystick: Joystick = null;
  protected isJoystickDown: boolean = false;

  public getJoystick(): Joystick {
    return this.joystick;
  }

  public init(): void {
    this.initOverlay();
    this.initJoystick();
    this.listenEvents();
  }

  protected initOverlay(): void {
    const overlay = new Sprite(Assets.cache.get("empty"));
    this.overlay = overlay;
    this.addChild(overlay);
    overlay.eventMode = 'static';
  }

  protected initJoystick(): void {
    const joystick = new Joystick();
    this.joystick = joystick;
    this.addChild(joystick);
    joystick.init();
  }

  protected listenEvents(): void {
    Game.events.on('resize', this.onResize, this);

    const overlay = this.overlay;
    overlay.on('pointerdown', this.onPointerDown, this);
    overlay.on('pointerup', this.onPointerUp, this);
    overlay.on('pointermove', this.onPointerMove, this);
  }

  protected onPointerDown(event: FederatedPointerEvent): void {
    const { x, y} = this.toLocal(event.global);
    this.isJoystickDown = true;
    this.joystick.onStarted(x, y);
  }

  protected onPointerUp(event: FederatedPointerEvent): void {
    this.releaseJoystick();
  }

  protected onPointerMove(event: FederatedPointerEvent): void {
    if (this.isJoystickDown) {
      const { x, y} = this.toLocal(event.global);
      this.joystick.onMove(x, y);
    }
  }

  protected resetJoystickState(): void {
    this.isJoystickDown = false;
  }

  protected releaseJoystick(): void {
    this.resetJoystickState();
    this.joystick.release();
  }

  protected onResize(): void {
    const layout = Game.layout;

    const overlay = this.overlay;
    overlay.width = layout.width;
    overlay.height = layout.height;

    this.releaseJoystick();

    const joystick = this.joystick;
    const joystickScale = layout.PL(
      Math2.min(1.3, layout.height / 1200),
      Math2.min(1.3, layout.width / 1200),
    );
    const joystickSize = joystick.getRadius() * joystickScale;
    joystick.scale.set(joystickScale);

    joystick.setDefaultPosition(
      layout.width * 0.95 - joystickSize,
      layout.height * 0.95 - joystickSize
    );
  }
}
