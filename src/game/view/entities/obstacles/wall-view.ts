import { Container, Graphics } from "pixi.js";
import { Obstacle } from "../../../model/entities/obstacles/obstacle";
import { AbstractEntityView } from "../entity-view";
import { GameConfig } from "../../../data/game-config";

export class WallView extends AbstractEntityView<Obstacle> {
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
    const width = (<any>wall).width * GameConfig.ViewScale;
    const height = (<any>wall).height * GameConfig.ViewScale;
    view.beginFill(0x0000ff);
    view.drawRect(width * -0.5, height * -0.5, width, height);
    view.endFill();
    this.debugView = view;
  }

  protected initView(): void {
    // walls' view are provided by the map bg, so no need to draw extra stuff
  }
}
