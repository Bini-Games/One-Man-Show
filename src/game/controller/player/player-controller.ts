import { Game } from "../../../core/facade/game";
import { Math2 } from "../../../core/math/math2";
import Camera from "../../../core/screen/camera";
import { AbstractService } from "../../../core/services/abstract-service";
import { GameConfig } from "../../data/game-config";
import { Parent } from "../../model/entities/parent";
import { World } from "../../model/world";
import { Joystick } from "../../ui/joystick/joystick";
import { UIService } from "../../ui/ui-service";

export class PlayerController extends AbstractService {
  public static readonly key: string = "PlayerController";

  protected parent: Parent = null;
  protected joystick: Joystick = null;
  protected camera: Camera = null;
  protected isMoving: boolean = false;

  constructor() {
    super(PlayerController.key);
  }

  public init(): void {
    this.parent = Game.getService<World>(World.key).getParent();
    this.joystick = Game.getService<UIService>(UIService.key).ui.getJoystick();
    this.camera = Game.getService<Camera>(Camera.key);

    this.listenEvents();
  }

  protected listenEvents(): void {
    this.joystick.onChanged.connect(this.onJoystickChanged.bind(this));
    Game.events.on('update', this.update, this);
    Game.events.on('resize', this.onResize, this);
  }

  protected onJoystickChanged(x: number, y: number): void {
    if (x === 0 && y === 0) {
      this.parent.resetVelocity();
      this.isMoving = false;
    } else {
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
}
