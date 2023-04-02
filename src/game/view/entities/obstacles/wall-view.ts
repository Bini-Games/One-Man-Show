import { Container, Graphics } from "pixi.js";
import { Wall } from "../../../model/entities/obstacles/wall";
import { AbstractEntityView } from "../entity-view";
import { GameConfig } from "../../../data/game-config";

export class WallView extends AbstractEntityView<Wall> {
  protected debugView: Graphics = null;

  public addTo(parent: Container): void {
    parent.addChild(this.debugView);
  }

  protected setViewPosition(x: number, y: number): void {
    this.debugView.position.set(x, y);
  }

  public init(): void {
    this.initDebugView();
    this.initView();

    this.debugView.visible = GameConfig.DebugView;
  }

  protected initDebugView(): void {
    const wall = this.entity;
    const view = new Graphics();
    const width = wall.getWidth() * GameConfig.ViewScale;
    const height = wall.getHeight() * GameConfig.ViewScale;
    view.beginFill(0x0000ff);
    view.drawRect(width * -0.5, height * -0.5, width, height);
    view.endFill();
    this.debugView = view;
  }

  protected initView(): void {
    // walls' view are provided by the map bg, so no need to draw extra stuff
  }
}
