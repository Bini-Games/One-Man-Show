import { Game } from "../../../core/facade/game";
import { Camera } from "../../../core/screen/camera";
import { GameConfig } from "../../data/game-config";
import { Joystick } from "../../ui/joystick/joystick";
import { UIService } from "../../ui/ui-service";
import { ParentController } from "./parent-controller";

export class PlayerController extends ParentController {
  public static readonly key: string = ParentController.key;

  protected joystick: Joystick = null;
  protected camera: Camera = null;
  protected isMoving: boolean = false;

  public init(): void {
    super.init();

    this.joystick = Game.getService<UIService>(UIService.key).ui.getJoystick();
    this.camera = Game.getService(Camera.key);

    this.listenEvents();
  }

  protected listenEvents(): void {
    this.joystick.onChanged.connect(this.onJoystickChanged.bind(this));
    Game.events.on("gameplay:end", this.onGameplayEnded, this);
    Game.events.on("update", this.update, this);
    Game.events.on("resize", this.onResize, this);
  }

  protected onJoystickChanged(x: number, y: number): void {
    if (x === 0 && y === 0) {
      this.parent.resetVelocity();
      this.isMoving = false;
    } else {
      if (!this.cantAct()) {
        return;
      }

      const speed = GameConfig.ParentSpeed;

      const vx = x * speed;
      const vy = y * speed;

      this.parent.setVelocity(vx, vy);

      this.isMoving = true;
    }
  }

  protected update(): void {
    const parentPosition = this.parent.getPosition();
    const cameraCenter = parentPosition
      .clone()
      .multiplyByScalar(GameConfig.ViewScale);
    this.camera.animateCenter(cameraCenter);
  }

  protected onResize(): void {
    const layout = Game.layout;
    const cameraZoom = layout.PL(
      1300 / layout.width,
      1500 / layout.width,
    );
    this.camera.animateZoom(cameraZoom);
  }

  protected onGameplayEnded(): void {
    this.joystick.release();
    this.parent.resetVelocity();
    this.isMoving = false;
  }
}
