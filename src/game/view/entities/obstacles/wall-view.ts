import { Container, Graphics } from "pixi.js";
import { Obstacle } from "../../../model/entities/obstacles/obstacle";
import { AbstractEntityView } from "../entity-view";
import { GameConfig } from "../../../data/game-config";

export class WallView extends AbstractEntityView<Obstacle> {
  protected view: Graphics = null;

  public addTo(parent: Container): void {
    parent.addChild(this.view);
  }

  protected setViewPosition(x: number, y: number): void {
    this.view.position.set(x, y);
  }

  protected initView(): void {
    const wall = this.entity;
    const view = new Graphics();
    const width = (<any>wall).width * GameConfig.ViewScale;
    const height = (<any>wall).height * GameConfig.ViewScale;
    view.beginFill(0x0000ff);
    view.drawRect(width * -0.5, height * -0.5, width, height);
    view.endFill();
    this.view = view;
  }
}
