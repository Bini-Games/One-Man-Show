import { Game } from "../../../core/facade/game";
import { Math2 } from "../../../core/math/math2";
import { Vector2 } from "../../../core/math/vector2";
import { Camera } from "../../../core/screen/camera";
import { GameConfig } from "../../data/game-config";
import { ParentController } from "./parent-controller";

export class BotController extends ParentController {
  public static readonly key: string = ParentController.key;

  protected camera: Camera = null;

  public init(): void {
    super.init();

    this.camera = Game.getService(Camera.key);

    this.listenEvents();
  }

  protected listenEvents(): void {
    Game.events.on("fixedUpdate", this.fixedUpdate, this);
    Game.events.on("resize", this.onResize, this);
  }

  protected fixedUpdate(): void {
    if (!this.cantAct()) {
      return;
    }

    const parent = this.parent;
    const velocity = this.child
      .getPosition()
      .clone()
      .sub(parent.getPosition())
      .setLength(GameConfig.ParentSpeed);
    parent.setVelocity(velocity.x, velocity.y);
  }

  protected onResize(): void {
    const layout = Game.layout;
    const edgeOffset = 100;
    const boundsWidth = GameConfig.WorldViewSize + edgeOffset * 2;
    const boundsHeight = GameConfig.WorldViewSize + edgeOffset * 2;
    const desiredZoom = Math2.min(layout.screenWidth / boundsWidth, layout.screenHeight / boundsHeight);
    const camera = this.camera;
    camera.setZoom(desiredZoom);
    camera.setCenter(new Vector2(700 * 0.5));
  }
}
