import { Container } from "pixi.js";
import { Vector2 } from "../math/vector2";
import { Game } from "../facade/game";
import { Math2 } from "../math/math2";
import { AbstractService } from "../services/abstract-service";

export default class Camera extends AbstractService {
  public static readonly key: string = "Camera";

  protected container: Container;

  protected zoom: number = 1;
  protected targetZoom: number = 1;
  protected animatingZoom: boolean = false;

  protected center: Vector2 = new Vector2();
  protected targetCenter: Vector2 = new Vector2();
  protected animatingCenter: boolean = false;

  constructor() {
    super(Camera.key);
  }

  public init(): void {
    this.setupEvents();
  }

  public getCenter(): Vector2 {
    return this.center;
  }

  public setCenter(center: Vector2): void {
    this.center.copyFrom(center);
    this.targetCenter.copyFrom(center);
    this.updateCenter();
  }

  public getZoom(): number {
    return this.zoom;
  }

  public setZoom(zoom: number): void {
    this.zoom = zoom;
    this.targetZoom = zoom;
    this.updateZoom();
  }

  public isAnimatingZoom(): boolean {
    return this.animatingZoom;
  }

  public isAnimatingCenter(): boolean {
    return this.animatingCenter;
  }

  public isAnimating(): boolean {
    return this.animatingZoom || this.animatingCenter;
  }

  public setContainer(container: Container): void {
    this.container = container;
  }

  public animateZoom(to: number): void {
    this.animatingZoom = true;
    this.targetZoom = to;
  }

  public animateCenter(to: Vector2): void {
    this.animatingCenter = true;
    this.targetCenter.copyFrom(to);
  }

  protected setupEvents(): void {
    Game.events.on("update", this.update, this);
    Game.events.on("resize", this.onResize, this);
  }

  protected update(dt: number): void {
    const t = Math.min(1, dt * 3);

    if (this.animatingZoom) {
      const targetZoom = this.targetZoom;
      const zoom = Math2.lerp(this.zoom, targetZoom, t);

      if (Math2.equal(zoom, targetZoom)) {
        this.animatingZoom = false;
        this.zoom = targetZoom;
      } else {
        this.zoom = zoom;
      }

      this.updateZoom();
    }

    if (this.animatingCenter) {
      const targetCenter = this.targetCenter;
      const center = this.center;

      center.lerp(targetCenter, t);

      if (center.equals(targetCenter)) {
        this.animatingCenter = false;
        center.copyFrom(targetCenter);
      }

      this.updateCenter();
    }
  }

  protected onResize(): void {
    const layout = Game.layout;
    this.container.position.set(layout.screenWidth * 0.5, layout.screenHeight * 0.5);
  }

  protected updateZoom(): void {
    this.container.scale.set(this.zoom);
  }

  protected updateCenter(): void {
    this.container.pivot.copyFrom(this.center);
  }
}
