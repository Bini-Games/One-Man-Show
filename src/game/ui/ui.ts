import { Assets, Container, FederatedPointerEvent, Sprite } from "pixi.js";
import { Joystick } from "./joystick/joystick";
import { Game } from "../../core/facade/game";
import { Math2 } from "../../core/math/math2";
import { GameConfig } from "../data/game-config";
import { ScoreCounter } from "./score/score-counter";
import { ResultScreen } from "./result-screen/result-screen";

export class UI extends Container {
  protected overlay: Sprite = null;
  protected joystick: Joystick = null;
  protected scoreCounter: ScoreCounter = null;
  protected resultScreen: ResultScreen = null;
  protected isJoystickDown: boolean = false;

  public getJoystick(): Joystick {
    return this.joystick;
  }

  public init(): void {
    this.initOverlay();
    this.initJoystick();
    this.initScoreCounter();
    this.initResultScreen();
    this.listenEvents();

    this.joystick.visible = !GameConfig.IsLearning;
  }

  protected initOverlay(): void {
    const overlay = new Sprite(Assets.cache.get("empty"));
    this.overlay = overlay;
    this.addChild(overlay);
    overlay.eventMode = "static";
  }

  protected initJoystick(): void {
    const joystick = new Joystick();
    this.joystick = joystick;
    this.addChild(joystick);
    joystick.init();
  }

  protected initScoreCounter(): void {
    const scoreCounter = new ScoreCounter();
    this.scoreCounter = scoreCounter;
    this.addChild(scoreCounter);
    scoreCounter.init();
  }

  protected initResultScreen(): void {
    const resultScreen = new ResultScreen();
    this.resultScreen = resultScreen;
    this.addChild(resultScreen);
    resultScreen.init();
  }

  protected listenEvents(): void {
    Game.events.on("resize", this.onResize, this);

    const overlay = this.overlay;
    overlay.on("pointerdown", this.onPointerDown, this);
    overlay.on("pointerup", this.onPointerUp, this);
    overlay.on("pointermove", this.onPointerMove, this);
  }

  protected onPointerDown(event: FederatedPointerEvent): void {
    Game.events.emit("pointerdown", event);

    const { x, y} = this.toLocal(event.global);
    this.isJoystickDown = true;
    this.joystick.onStarted(x, y);
  }

  protected onPointerUp(event: FederatedPointerEvent): void {
    Game.events.emit("pointerup", event);

    this.releaseJoystick();
  }

  protected onPointerMove(event: FederatedPointerEvent): void {
    Game.events.emit("pointermove", event);

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
