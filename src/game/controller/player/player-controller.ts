import { AbstractService } from "../../../core/services/abstract-service";
import { GameConfig } from "../../data/game-config";
import { Parent } from "../../model/entities/parent";
import { Joystick } from "../../ui/joystick/joystick";

export class PlayerController extends AbstractService {
  public static readonly key: string = "PlayerController";

  protected parent: Parent = null;
  protected joystick: Joystick = null;
  protected isMoving: boolean = false;

  constructor() {
    super(PlayerController.key);
  }

  public init(parent: Parent, joystick: Joystick): void {
    this.parent = parent;
    this.joystick = joystick;
    this.listenEvents();
  }

  protected listenEvents(): void {
    this.joystick.onChanged.connect(this.onJoystickChanged.bind(this));
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
}
